import YoutubePlayer from "youtube-player"
import { YouTubePlayer } from "youtube-player/dist/types"

let currentMusic: HTMLAudioElement | null = null
let player: YouTubePlayer | null

async function playMusic(path: string) {
    if (path.startsWith("https://") || path.startsWith("http://")) {
        if (currentMusic != null) { currentMusic.pause(); currentMusic = null }
        const key = new URL(path).searchParams.get("v")
        if (player != null) {
            if (await player.getVideoEmbedCode() == key) { return 0 }
            else { await player.stopVideo(); await player.destroy(); player = null }
        }
        player = YoutubePlayer("youtubePlayer")
        console.log(path)
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
        currentMusic.addEventListener("ended", () => { currentMusic = null })
    }
}

async function stopMusic():Promise<void> {
    if (currentMusic == null || player == null) { return }

    if (currentMusic != null) {
        if (!currentMusic.paused) { currentMusic.pause() }
        else { currentMusic.play() }
    } else {
        if (await player.getPlayerState() == 1) { await player.pauseVideo() }
        else if (await player.getPlayerState() == 2) { await player.playVideo() }
    }
}

window.playMusic = playMusic