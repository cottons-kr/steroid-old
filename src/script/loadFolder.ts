import { parse } from "path"

type jsObject = {
    [index: string]: any
}

const folderInput = document.querySelector<HTMLInputElement>("#uploadFolerInput")
const codecs = [".wav", ".mp3", ".mp4", ".ogg", ".flac"]

folderInput.addEventListener("change", (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files.length <= 0) { alert("빈 폴더입니다"); return 0 }
    const dirName = files[0].webkitRelativePath.split("/")[0]
    new Promise((resolve, _reject) => {
        let playlist: object = {}
        for (let i=0; i<files.length; i++) {
            codecs.forEach(codec => {
                if (files[i].name.includes(codec)) {
                    // @ts-ignore
                    playlist[parse(files[i].name).name] = files[i].path
                }
            })
        }
        resolve(playlist)
    }).then((list: any) => {
        if (localStorage["playlist"] == undefined) {localStorage["playlist"] = "{}"}
        let savedList: jsObject = JSON.parse(localStorage["playlist"])
        savedList[dirName] = list
        localStorage["playlist"] = JSON.stringify(savedList)
        loadList()
    })
})
