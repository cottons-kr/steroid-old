const playlistPopupDragBar: HTMLElement | any = document.querySelector("#playlistRoot #dragBar")
const youtubeListInputPopupDragBar = document.querySelector<HTMLElement>("#youtubeListInputPopup")
const playlistPopup = document.querySelector<HTMLElement>("#playlistRoot")
const youtubeListInputPopup = document.querySelector<HTMLElement>("#youtubeListInputPopup")
const root = document.querySelector(".root")

function windowDrag(element: HTMLElement, e: MouseEvent) {
    let shiftX: number = e.clientX - element.getBoundingClientRect().left
    let shiftY: number = e.clientY - element.getBoundingClientRect().top

    element.style.position = 'absolute'
    element.style.zIndex = "1000"
    root.append(element)

    function moveAt(pageX: number, pageY: number) {
        element.style.left = pageX - shiftX + 'px'
        element.style.top = pageY - shiftY + 'px'
    }
    moveAt(e.pageX, e.pageY)

    function onMouseMove(e: MouseEvent) {
        moveAt(e.pageX, e.pageY)
    }

    document.addEventListener('mousemove', onMouseMove);

    element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove)
        element.onmouseup = null
    }
}

playlistPopupDragBar.onmousedown = (e: MouseEvent) => { windowDrag(playlistPopup, e) }
youtubeListInputPopupDragBar.onmousedown = (e: MouseEvent) => { windowDrag(youtubeListInputPopup, e) }