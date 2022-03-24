const playlistPopupDragBar = document.querySelector("#playlistRoot #dragBar");
const youtubeListInputPopupDragBar = document.querySelector("#youtubeListInputPopup");
const playlistPopup = document.querySelector("#playlistRoot");
const youtubeListInputPopup = document.querySelector("#youtubeListInputPopup");
const root = document.querySelector(".root");
function windowDrag(element, e) {
    let shiftX = e.clientX - element.getBoundingClientRect().left;
    let shiftY = e.clientY - element.getBoundingClientRect().top;
    element.style.position = 'absolute';
    element.style.zIndex = "1000";
    root.append(element);
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
    moveAt(e.pageX, e.pageY);
    function onMouseMove(e) {
        moveAt(e.pageX, e.pageY);
    }
    document.addEventListener('mousemove', onMouseMove);
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}
playlistPopupDragBar.onmousedown = (e) => { windowDrag(playlistPopup, e); };
youtubeListInputPopupDragBar.onmousedown = (e) => { windowDrag(youtubeListInputPopup, e); };
//# sourceMappingURL=windowDrag.js.map