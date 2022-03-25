import * as path  from "path";
export {}

declare global {
    interface Window { playMusic: any; }
    interface Window { addList: any; }
}

function resizeFont():void {
    document.querySelector("html").style.fontSize = `${16 * (window.innerHeight/1080)}px`
}

window.addEventListener("resize", resizeFont)

window.onload = () => {
    clearList()
    loadList()
    resizeFont()
    loadSaveData()
}

// jsObject Type is in loadList.ts

