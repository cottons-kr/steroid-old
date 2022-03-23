import * as puppeteer from "puppeteer"

type jsObject = {
    [index: string]: any
}

const youtubeList = document.querySelector<HTMLElement>("#youtubeList")
const youtubeListInputPopup = document.querySelector<HTMLElement>("#youtubeListInputPopup")
const youtubeLinkInput = youtubeListInputPopup.querySelector<HTMLInputElement>("input")

let num = 0
youtubeList.addEventListener("click", () => {
    num += 1
    if (num % 2 == 0) { youtubeListInputPopup.style.display = "none" }
    else { youtubeListInputPopup.style.display = "block" }
})

async function scrollToBtm(page: puppeteer.Page) {
    await page.evaluate(async () => {
        await new Promise((resolve, _reject) => {
            let currentHeight = 0
            let scrollInterval = setInterval(function() {
                let pageBottom = document.documentElement.scrollHeight
                if(currentHeight < pageBottom) {
                    document.documentElement.scrollTop = document.documentElement.scrollHeight
                    currentHeight = pageBottom
                } else {
                    clearInterval(scrollInterval);
                    resolve(0)
                }
            }, 700)
        })
    })
}

async function getYoutubeList(url: string="https://www.youtube.com/playlist?list=PLC7IbGRZ5AEjMZhKR1p6b_CpOqHWYI2Sj") {
    const mobile = puppeteer.devices["iPhone 6"]
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    await page.emulate(mobile)
    await page.goto(url)
    await scrollToBtm(page)

    const videos = await page.$eval("#app > div.page-container > ytm-browse > ytm-single-column-browse-results-renderer > div > div > ytm-section-list-renderer > lazy-list > ytm-item-section-renderer > lazy-list > ytm-playlist-video-list-renderer",
    element => {
        let list: jsObject = {}
        for (let video of element.childNodes) {
            // @ts-ignore
            const name: string = video.querySelector("h4").innerText; const link = video.querySelector("a").href
            list[name] = link
        }
        return list
    })
    return videos
}

youtubeLinkInput.addEventListener("change", async () => {
    const link = youtubeLinkInput.value
    youtubeLinkInput.value = ""
    let videos: jsObject = {}
    await getYoutubeList(link)
    .then(res => {videos = JSON.parse(JSON.stringify(res))})
    .catch(err => {alert(err)})
    console.log(videos)
})