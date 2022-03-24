import * as puppeteer from "puppeteer"

const youtubeList = document.querySelector<HTMLElement>("#youtubeList")
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
    if (url.includes("app=desktop")) { url = url.replace("app=desktop", "") }
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
    const name = await page.$eval("#app > div.page-container > ytm-browse > ytm-playlist-header-renderer > div.playlist-header > div > div:nth-child(1) > h2",
    element => { return element.innerHTML })
    await browser.close()
    return [videos, name]
}

youtubeLinkInput.addEventListener("change", async () => {
    const link = youtubeLinkInput.value
    youtubeLinkInput.value = ""
    let videos: jsObject = {}
    let name: any
    await getYoutubeList(link)
    .then(res => {
        videos = JSON.parse(JSON.stringify(res[0]))
        name = res[1]
    })
    .catch(err => { alert(err); return 0 })
    addList(videos, name)
})
