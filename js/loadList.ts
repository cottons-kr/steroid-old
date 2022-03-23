const playlist = document.querySelector<HTMLInputElement>("#playlist")

function mkParentDir() {
    const div = document.createElement("div")
    const img = document.createElement("img")
    div.setAttribute("id", "parentDir")
    img.setAttribute("src", "asset/back.svg")
    div.appendChild(img)
    return div
}

function mkContent(name: string) {
    const div = document.createElement("div")
    div.setAttribute("id", "content")
    div.innerText = name
    return div
}

function mkListContent(name: string) {
    const div = document.createElement("div")
    div.setAttribute("id", "content")
    div.innerText = name
    return div
}

function loadList() {
    if (localStorage["playlist"] == undefined) {
        localStorage["playlist"] = "{}"
        playlist.innerText = "플레이리스트가 없어요"
        return 0
    }
    let list = JSON.parse(localStorage["playlist"])
    while (playlist.hasChildNodes()) {playlist.removeChild(playlist.firstChild)}
    for (let name of Object.keys(list)) { playlist.appendChild(mkListContent(name)) }
}

window.onload = () => {
    loadList()
}