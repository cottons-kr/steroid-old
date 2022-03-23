import YouTubePlayer from "youtube-player"

let currentMusic: HTMLAudioElement | null = null

function playMusic(path: string) {
    if (path.startsWith("https://") || path.startsWith("http://")) {
        return 0
    }
    else {
        if (currentMusic != null) {
            // @ts-ignore
            if (currentMusic.src == `file://${path.replaceAll(" ", "%20")}`) { return 0 }
            else { currentMusic.pause(); currentMusic = null }
        }
        currentMusic = new Audio(path)
        currentMusic.play()
    }
}

export default playMusic