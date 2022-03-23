const youtubeList = document.querySelector<HTMLElement>("#youtubeList")
const youtubeListInputPopup = document.querySelector<HTMLElement>("#youtubeListInputPopup")

let num = 0
youtubeList.addEventListener("click", () => {
    num += 1
    if (num % 2 == 0) {
        youtubeListInputPopup.style.display = "none"
    }
    else {
        youtubeListInputPopup.style.display = "block"
    }
})