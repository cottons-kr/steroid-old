const playlist = document.querySelector<HTMLInputElement>("#playlist")
const selectedListText = document.querySelector<HTMLElement>("#selectedList")
const currentMusicName = document.querySelector<HTMLElement>("#currentMusicName")
const deleteListBtn = document.querySelector<HTMLElement>("#deleteList")
let selectedList: string | null
let deleteMode: boolean = false

type jsObject = {
    [index: string]: any
}

function clearList() {
    while (playlist.hasChildNodes()) {playlist.removeChild(playlist.firstChild)}
}

function addList(list: jsObject, name: string) {
    if (localStorage["playlist"] == undefined) {localStorage["playlist"] = "{}"}
    let savedList: jsObject = JSON.parse(localStorage["playlist"])
    savedList[name] = list
    localStorage["playlist"] = JSON.stringify(savedList)
    if (selectedList == null) { loadList() }
}

function mkParentDir() {
    const div = document.createElement("div")
    const img = document.createElement("img")
    div.setAttribute("id", "parentDir")
    img.setAttribute("src", "asset/back.svg")
    div.appendChild(img)

    div.addEventListener("click", () => {
        deleteListBtn.style.display = "block"
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

    div.addEventListener("click", async () => {
        currentMusicName.innerText = name
        await window.playMusic(path)
    })
    return div
}

function mkListContent(name: string) {
    const div = document.createElement("div")
    div.setAttribute("id", "content")
    div.innerText = name

    div.addEventListener("click", () => {
        if (deleteMode) { deleteList(name); return }
        clearList()
        deleteListBtn.style.display = "none"
        deleteMode = false
        selectedList = name
        selectedListText.innerText = name
        playlist.appendChild(mkParentDir())
        const list: Array<jsObject> = JSON.parse(localStorage["playlist"])[selectedList]
        for (let song of list) {
            playlist.appendChild(mkContent(song["name"], song["path"]))
        }
    })
    return div
}

function loadList() {
    if (localStorage["playlist"] == undefined || Object.keys(JSON.parse(localStorage["playlist"])).length <= 0) {
        localStorage["playlist"] = "{}"
        playlist.innerText = "플레이리스트가 없어요"
        return 0
    }
    clearList()
    let list: jsObject = JSON.parse(localStorage["playlist"])
    for (let name of Object.keys(list)) { 
        if (list[name].length <= 0) { continue }
        playlist.appendChild(mkListContent(name))
    }
}

function deleteList(name: string):void {
    let list: jsObject = JSON.parse(localStorage["playlist"])
    delete list[name]
    localStorage["playlist"] = JSON.stringify(list)
    loadList()
}

deleteListBtn.addEventListener("click", () => {
    if (deleteMode) {
        deleteMode = false
        if (selectedList != null) { currentMusicName.innerText = selectedList }
        else { selectedListText.innerText = "플레이리스트" }
    }
    else {
        deleteMode = true
        selectedListText.innerText = "클릭해서 삭제"
    }
})

window.addList = addList