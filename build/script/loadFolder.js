"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const folderInput = document.querySelector("#uploadFolerInput");
const codecs = [".wav", ".mp3", ".mp4", ".ogg", ".flac"];
folderInput.addEventListener("change", (e) => {
    const files = e.target.files;
    if (files.length <= 0) {
        alert("빈 폴더입니다");
        return 0;
    }
    const dirName = files[0].webkitRelativePath.split("/")[0];
    new Promise((resolve, _reject) => {
        let playlist = {};
        for (let i = 0; i < files.length; i++) {
            codecs.forEach(codec => {
                if (files[i].name.includes(codec)) {
                    // @ts-ignore
                    playlist[(0, path_1.parse)(files[i].name).name] = files[i].path;
                }
            });
        }
        resolve(playlist);
    }).then((list) => {
        addList(list, dirName);
    });
});
//# sourceMappingURL=loadFolder.js.map