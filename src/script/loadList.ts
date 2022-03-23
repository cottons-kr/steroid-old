const playlist = document.querySelector<HTMLInputElement>("#playlist")
const selectedListText = document.querySelector<HTMLElement>("#selectedList")
let selectedList: string | null

type jsObject = {
    [index: string]: any
}

function clearList() {
    while (playlist.hasChildNodes()) {playlist.removeChild(playlist.firstChild)}
}

function mkParentDir() {
    const div = document.createElement("div")
    const img = document.createElement("img")
    div.setAttribute("id", "parentDir")
    img.setAttribute("src", "asset/back.svg")
    div.appendChild(img)

    div.addEventListener("click", () => {
        selectedList = null
        selectedListText.innerText = "플레이리스트"
        loadList()
    })
    return div
}

function mkContent(name: string, path: string) {
    const div = document.createElement("div")
    div.setAttribute("id", "content")
    div.innerText = name

    div.addEventListener("click", () => { playMusic(path) })
    return div
}

function mkListContent(name: string) {
    const div = document.createElement("div")
    div.setAttribute("id", "content")
    div.innerText = name

    div.addEventListener("click", () => {
        clearList()
        selectedList = name
        selectedListText.innerText = name
        playlist.appendChild(mkParentDir())
        const list: jsObject = JSON.parse(localStorage["playlist"])[name]
        for (let song of Object.keys(list)) {
            playlist.appendChild(mkContent(song, list[song]))
        }
    })
    return div
}

function loadList() {
    if (localStorage["playlist"] == undefined) {
        localStorage["playlist"] = "{}"
        playlist.innerText = "플레이리스트가 없어요"
        return 0
    }
    clearList()
    let list = JSON.parse(localStorage["playlist"])
    for (let name of Object.keys(list)) { playlist.appendChild(mkListContent(name)) }
}

window.onload = () => {
    clearList()
    loadList()
}