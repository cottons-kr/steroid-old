const playlist = document.querySelector("#playlist");
const selectedListText = document.querySelector("#selectedList");
let selectedList;
function clearList() {
    while (playlist.hasChildNodes()) {
        playlist.removeChild(playlist.firstChild);
    }
}
function addList(list, name) {
    if (localStorage["playlist"] == undefined) {
        localStorage["playlist"] = "{}";
    }
    let savedList = JSON.parse(localStorage["playlist"]);
    savedList[name] = list;
    localStorage["playlist"] = JSON.stringify(savedList);
    if (selectedList == null) {
        loadList();
    }
}
function mkParentDir() {
    const div = document.createElement("div");
    const img = document.createElement("img");
    div.setAttribute("id", "parentDir");
    img.setAttribute("src", "asset/back.svg");
    div.appendChild(img);
    div.addEventListener("click", () => {
        selectedList = null;
        selectedListText.innerText = "플레이리스트";
        loadList();
    });
    return div;
}
function mkContent(name, path) {
    const div = document.createElement("div");
    div.setAttribute("id", "content");
    div.innerText = name;
    div.addEventListener("click", async () => { await window.playMusic(path); });
    return div;
}
function mkListContent(name) {
    const div = document.createElement("div");
    div.setAttribute("id", "content");
    div.innerText = name;
    div.addEventListener("click", () => {
        clearList();
        selectedList = name;
        selectedListText.innerText = name;
        playlist.appendChild(mkParentDir());
        const list = JSON.parse(localStorage["playlist"])[name];
        for (let song of Object.keys(list)) {
            playlist.appendChild(mkContent(song, list[song]));
        }
    });
    return div;
}
function loadList() {
    if (localStorage["playlist"] == undefined) {
        localStorage["playlist"] = "{}";
        playlist.innerText = "플레이리스트가 없어요";
        return 0;
    }
    clearList();
    let list = JSON.parse(localStorage["playlist"]);
    for (let name of Object.keys(list)) {
        if (list[name].length <= 0) {
            continue;
        }
        playlist.appendChild(mkListContent(name));
    }
}
window.onload = () => {
    clearList();
    loadList();
};
window.addList = addList;
//# sourceMappingURL=loadList.js.map