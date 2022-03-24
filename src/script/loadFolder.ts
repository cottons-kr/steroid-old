import { parse } from "path"

const folderInput = document.querySelector<HTMLInputElement>("#uploadFolerInput")
const codecs = [".wav", ".mp3", ".mp4", ".ogg", ".flac"]

folderInput.addEventListener("change", (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files.length <= 0) { alert("빈 폴더입니다"); return 0 }
    const dirName = files[0].webkitRelativePath.split("/")[0]
    new Promise((resolve, _reject) => {
        let playlist: Array<jsObject> = []
        for (let i=0; i<files.length; i++) {
            codecs.forEach(codec => {
                if (files[i].name.includes(codec)) {
                    playlist.push({"name": parse(files[i].name).name, "path": files[i].path})
                }
            })
        }
        resolve(playlist)
    }).then((list: any) => {
        addList(list, dirName)
    })
})
