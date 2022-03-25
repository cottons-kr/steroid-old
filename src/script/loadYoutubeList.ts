import puppeteer from "puppeteer"

const youtubeList = document.querySelector<HTMLElement>("#youtubeList")
const youtubeLinkInput = youtubeListInputPopup.querySelector<HTMLInputElement>("input")

const devices = {
    name: 'iPhone 6',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    viewport: {
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        isLandscape: false,
    },
}

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

async function getYoutubeList(url: string) {
    const mobile = devices
    if (url.includes("app=desktop")) { url = url.replace("app=desktop", "") }
    if (!url.includes("/playlist?list=") && url.includes("/watch?v=")) { return ["video"] }
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    await page.emulate(mobile)
    await page.goto(url)
    await scrollToBtm(page)

    const videos = await page.$eval("#app > div.page-container > ytm-browse > ytm-single-column-browse-results-renderer > div > div > ytm-section-list-renderer > lazy-list > ytm-item-section-renderer > lazy-list > ytm-playlist-video-list-renderer",
    element => {
        let list: Array<jsObject> = []
        for (let video of element.childNodes) {
            // @ts-ignore
            const name: string = video.querySelector("h4").innerText; const link = video.querySelector("a").href
            list.push({"name": name, "path": link})
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
    .then(async res => {
        if (res[0] == "video") { 
            const mobile = devices
            const browser = await puppeteer.launch({headless: true})
            const page = await browser.newPage()
            await page.emulate(mobile)
            await page.goto(link)
            await page.waitForSelector("#app > div.page-container > ytm-watch > ytm-single-column-watch-next-results-renderer > ytm-slim-video-metadata-section-renderer > ytm-slim-video-information-renderer > button > div > div > h2")
            const name = await page.$eval("#app > div.page-container > ytm-watch > ytm-single-column-watch-next-results-renderer > ytm-slim-video-metadata-section-renderer > ytm-slim-video-information-renderer > button > div > div > h2",
            title => { return title.innerHTML })
            currentMusicName.innerText = name
            await window.playMusic(link)
        } else {
            videos = JSON.parse(JSON.stringify(res[0]))
            name = res[1]
        }
    })
    .catch(err => { alert(err); return 0 })
    addList(videos, name)
})
