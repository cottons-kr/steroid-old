let currentMusic: HTMLAudioElement | null = null

function playMusic(path: string) {
    if (currentMusic != null) {
        // @ts-ignore
        if (currentMusic.src == `file://${path.replaceAll(" ", "%20")}`) { return 0 }
        else { currentMusic.pause(); currentMusic = null }
    }
    currentMusic = new Audio(path)
    currentMusic.play()
}