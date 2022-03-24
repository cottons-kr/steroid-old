import YoutubePlayer from "youtube-player"
import { YouTubePlayer } from "youtube-player/dist/types"

let currentMusic: HTMLAudioElement | null = null
let player: YouTubePlayer | null = null
let status: number = 2
let valuePerSec: number = 0
let timeout: NodeJS.Timeout | any = null
let progressInterval: NodeJS.Timeout | any = null

const backwardBtn = document.querySelector<HTMLElement>("#backwardBtn")
const playStopBtn = document.querySelector<HTMLElement>("#playStopBtn")
const forwardBtn = document.querySelector<HTMLElement>("#forwardBtn")
const progressBar = document.querySelector<HTMLProgressElement>("#progressBar")
const progressTime = document.querySelector<HTMLElement>("#progressTime")

async function playMusic(path: string) {
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
        progressBar.value = 0
        for (let i=0; i<10; i++) { clearInterval(progressInterval) }
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
        progressBar.value = 0
        for (let i=0; i<10; i++) { clearInterval(progressInterval) }
        currentMusic.addEventListener("ended", () => {
            timeout = setTimeout(async () => {await changeMusic("forward")
        }, 1000) })
        currentMusic.onloadedmetadata = () => {
            valuePerSec = 100 / (currentMusic.duration * 5)
            progressInterval = setInterval(() => { if (status == 1) {progressBar.value += valuePerSec} }, 200)
        }
    }
    playStopBtn.querySelector("img").src = "asset/pause.svg"
    status = 1
}

async function stopMusic():Promise<void> {
    if (currentMusic == null && player == null) { return }

    if (currentMusic != null) {
        if (!currentMusic.paused) {
            currentMusic.pause()
            status = 2
            clearInterval(progressInterval)
        }
        else {
            currentMusic.play(); status = 1
            progressInterval = setInterval(() => { if (status == 1) {progressBar.value += valuePerSec} }, 200)
        }
    } else {
        if (await player.getPlayerState() == 1) {
            await player.pauseVideo()
            status = 2
            clearInterval(progressInterval)
        }
        else if (await player.getPlayerState() == 2) {
            await player.playVideo(); status = 1
            progressInterval = setInterval(() => { if (status == 1) {progressBar.value += valuePerSec} }, 200)
        }
    }
}

async function changeMusic(type: string | number) {
    if (selectedList == null) { return }
    if (type == "forward") { type = 1} else { type = -1 }
    if (timeout != null) { clearInterval(timeout) }
    clearInterval(progressInterval)
    valuePerSec = 0
    const list: Array<jsObject> = JSON.parse(localStorage["playlist"])[selectedList]
    let nextMusic: number = list.findIndex(music => music.name == currentMusicName.innerText)+type
    if (list[nextMusic] == undefined) { nextMusic = 0; currentMusicName.innerText = list[0]["name"] }
    else { currentMusicName.innerText = list[nextMusic]["name"] }
    await playMusic(list[nextMusic]["path"])
}

progressBar.addEventListener("mousedown", (e: MouseEvent) => {
    if (currentMusic == null && player == null) { return 0 }
    const clickedValue = e.offsetX / progressBar.offsetWidth * 100
    const value = currentMusic.duration / 100
    progressBar.value = clickedValue
    currentMusic.currentTime = value * progressBar.value
})
progressBar.addEventListener("mousemove", (e: MouseEvent) => {
    if (currentMusic == null && player == null) { return 0 }
    progressTime.style.display = "block"

    const value = currentMusic.duration / 100
    const clickedValue = e.offsetX / progressBar.offsetWidth * 100
    let time = Math.floor(clickedValue * value)
    let min = Math.floor(time / 60).toString().padStart(2, "0")
    let sec = (time % 60).toString().padStart(2, "0")
    progressTime.innerText = `${min}:${sec}`
    progressTime.style.left = e.pageX+"px"
})
progressBar.addEventListener("mouseleave", () => { progressTime.style.display = "none" })

playStopBtn.addEventListener("click", async () => {
    if (currentMusic == null && player == null) { return }
    await stopMusic()
    if (status == 1) { playStopBtn.querySelector("img").src = "asset/pause.svg" }
    else if (status == 2) { playStopBtn.querySelector("img").src = "asset/play.svg" }
})
forwardBtn.addEventListener("click", async () => { await changeMusic("forward") })
backwardBtn.addEventListener("click", async () => { await changeMusic("backward") })

window.playMusic = playMusic