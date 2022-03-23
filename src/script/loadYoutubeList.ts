import * as puppeteer from "puppeteer"

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
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.emulate(mobile)
    await page.goto(url)
    await scrollToBtm(page)
}