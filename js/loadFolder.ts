import { parse } from "path"

const folderInput = document.querySelector<HTMLInputElement>("#uploadFolerInput")
const playlist = document.querySelector<HTMLInputElement>("#playlist")
const codecs = [".wav", ".mp3", ".mp4", ".ogg", ".flac", ".html"]

folderInput.addEventListener("change", (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
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
        if (localStorage["playlist"] == undefined) {localStorage["playlist"] = "[]"}
        let savedList: Array<object> = JSON.parse(localStorage["playlist"])
        savedList.push({[dirName]: list})
        localStorage["playlist"] = JSON.stringify(savedList)
    })
})