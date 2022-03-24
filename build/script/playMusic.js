"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playMusic = void 0;
let currentMusic = null;
function playMusic(path) {
    if (path.startsWith("https://") || path.startsWith("http://")) {
        return 0;
    }
    else {
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
    }
}
exports.playMusic = playMusic;
//# sourceMappingURL=playMusic.js.map