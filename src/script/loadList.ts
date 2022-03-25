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
        makeListBtn.style.display = "block"
        uploadFolder.style.display = "block"
        youtubeListBtn.style.display = "block"
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
        makeListBtn.style.display = "none"
        uploadFolder.style.display = "none"
        youtubeListBtn.style.display = "none"
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

async function makeList() { 
    /* 팝업으로 플레이리스트 이름 받고
    파일 추가, 유튜브 영상 추가 버튼 보여주기
    파일 추가는 잘 만들고
    유튜브 영상은 링크 받으면 제목 크롤링해서 등록 
    이 모든 과정은 editList 함수를 사용바람
    매개변수 : listName: string, content: jsObject, type: string
    
    만약 폴더나 유튜브로 등록한 플레이리스트라면 파편화 방지를 위해 이 함수 사용 금지*/ 
}

function deleteList(name: string):void {
    let list: jsObject = JSON.parse(localStorage["playlist"])
    delete list[name]
    localStorage["playlist"] = JSON.stringify(list)
    loadList()
}

async function loadSaveData() {
    if (localStorage["saveData"] == undefined) { return }

    const saveData: jsObject = JSON.parse(localStorage["saveData"])
    volumeControl.value = parseInt(saveData["volume"])
    if (saveData["selectedList"] !== undefined) { selectedList = saveData["selectedList"] }

    if (saveData["currentMusicPath"] == null) { return }
    currentMusicName.innerText = saveData["currentMusicName"]
    
    await window.playMusic(saveData["currentMusicPath"])
    if (typeof JSON.parse(localStorage["playlist"])[selectedList] !== "object") { return }
    clearList()
    deleteListBtn.style.display = "none"
    makeListBtn.style.display = "none"
    uploadFolder.style.display = "none"
    youtubeListBtn.style.display = "none"
    deleteMode = false
    playlist.appendChild(mkParentDir())
    const list: Array<jsObject> = JSON.parse(localStorage["playlist"])[selectedList]
    for (let song of list) {
        playlist.appendChild(mkContent(song["name"], song["path"]))
   }
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
makeListBtn.addEventListener("click", async () => { await makeList() })

window.addList = addList
function reload():void { location.reload() }