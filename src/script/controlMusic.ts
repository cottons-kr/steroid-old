import YoutubePlayer from "youtube-player"
import { YouTubePlayer } from "youtube-player/dist/types"

let currentMusic: HTMLAudioElement | null = null
let player: YouTubePlayer | null
let status: number = 2
let timeout: NodeJS.Timeout | any = null
let progressInterval: NodeJS.Timeout | any = null

const backwardBtn = document.querySelector<HTMLElement>("#backwardBtn")
const playStopBtn = document.querySelector<HTMLElement>("#playStopBtn")
const forwardBtn = document.querySelector<HTMLElement>("#forwardBtn")
const progressBar = document.querySelector<HTMLProgressElement>("#progressBar")

async function playMusic(path: string) {
    progressBar.value = 0
    if (path.startsWith("https://") || path.startsWith("http://")) {
        if (currentMusic != null) { currentMusic.pause(); currentMusic = null }
        const key = new URL(path).searchParams.get("v")
        if (player != null) {
            if (await player.getVideoEmbedCode() == key) { return 0 }
            else { await player.stopVideo(); await player.destroy(); player = null }
        }
        player = YoutubePlayer("youtubePlayer")
        await player.loadVideoById(key)
        await player.playVideo()
        player.on("stateChange", (e) => {
            if (e.data == 0) { player.destroy(); player = null }
        })
    }
    else {
        if (player != null) { await player.stopVideo(); await player.destroy(); player = null }
        if (currentMusic != null) {
            // @ts-ignore
            if (currentMusic.src == `file://${path.replaceAll(" ", "%20")}`) { return 0 }
            else { currentMusic.pause(); currentMusic = null }
        }
        currentMusic = new Audio(path)
        currentMusic.play()
        currentMusic.addEventListener("ended", () => {
            timeout = setTimeout(async () => {await changeMusic("forward")
        }, 1000) })
        currentMusic.onloadedmetadata = () => {
            const value = 100 / (currentMusic.duration * 5)
            progressInterval = setInterval(() => { if (status == 1) {progressBar.value += value} }, 200)
        }
    }
    playStopBtn.querySelector("img").src = "asset/pause.svg"
    status = 1
}

async function stopMusic():Promise<void> {
    if (currentMusic == null && player == null) { return }

    if (currentMusic != null) {
        if (!currentMusic.paused) {
            currentMusic.pause(); status = 2
        }
        else {
            currentMusic.play(); status = 1
            currentMusic.onloadedmetadata = () => {
                const value = 100 / (currentMusic.duration * 5)
                progressInterval = setInterval(() => { if (status == 1) {progressBar.value += value} }, 200)
            }
        }
    } else {
        if (await player.getPlayerState() == 1) {
            await player.pauseVideo(); status = 2
        }
        else if (await player.getPlayerState() == 2) {
            await player.playVideo(); status = 1
            currentMusic.onloadedmetadata = () => {
                const value = 100 / (currentMusic.duration * 5)
                progressInterval = setInterval(() => { if (status == 1) {progressBar.value += value} }, 200)
            }
        }
    }
}

async function changeMusic(type: string | number) {
    if (selectedList == null) { return }
    if (type == "forward") { type = 1} else { type = -1 }
    if (timeout != null) { clearInterval(timeout);  clearInterval(progressInterval) }
    const list: Array<jsObject> = JSON.parse(localStorage["playlist"])[selectedList]
    let nextMusic: number = list.findIndex(music => music.name == currentMusicName.innerText)+type
    if (list[nextMusic] == undefined) { nextMusic = 0; currentMusicName.innerText = list[0]["name"] }
    else { currentMusicName.innerText = list[nextMusic]["name"] }
    await playMusic(list[nextMusic]["path"])
}

playStopBtn.addEventListener("click", async () => {
    if (currentMusic == null && player == null) { return }
    await stopMusic()
    if (status == 1) { playStopBtn.querySelector("img").src = "asset/pause.svg" }
    else if (status == 2) { playStopBtn.querySelector("img").src = "asset/play.svg" }
})
forwardBtn.addEventListener("click", async () => { await changeMusic("forward") })
backwardBtn.addEventListener("click", async () => { await changeMusic("backward") })

window.playMusic = playMusic