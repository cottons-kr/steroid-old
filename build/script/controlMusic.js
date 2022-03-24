"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_player_1 = __importDefault(require("youtube-player"));
let currentMusic = null;
let player;
async function playMusic(path) {
    if (path.startsWith("https://") || path.startsWith("http://")) {
        if (currentMusic != null) {
            currentMusic.pause();
            currentMusic = null;
        }
        const key = new URL(path).searchParams.get("v");
        if (player != null) {
            if (await player.getVideoEmbedCode() == key) {
                return 0;
            }
            else {
                await player.stopVideo();
                await player.destroy();
                player = null;
            }
        }
        player = (0, youtube_player_1.default)("youtubePlayer");
        console.log(path);
        await player.loadVideoById(key);
        await player.playVideo();
        player.on("stateChange", (e) => {
            if (e.data == 0) {
                player.destroy();
                player = null;
            }
        });
    }
    else {
        if (player != null) {
            await player.stopVideo();
            await player.destroy();
            player = null;
        }
        if (currentMusic != null) {
            // @ts-ignore
            if (currentMusic.src == `file://${path.replaceAll(" ", "%20")}`) {
                return 0;
            }
            else {
                currentMusic.pause();
                currentMusic = null;
            }
        }
        currentMusic = new Audio(path);
        currentMusic.play();
        currentMusic.addEventListener("ended", () => { currentMusic = null; });
    }
}
window.playMusic = playMusic;
//# sourceMappingURL=controlMusic.js.map