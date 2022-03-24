"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = __importStar(require("puppeteer"));
const youtubeList = document.querySelector("#youtubeList");
const youtubeLinkInput = youtubeListInputPopup.querySelector("input");
let num = 0;
youtubeList.addEventListener("click", () => {
    num += 1;
    if (num % 2 == 0) {
        youtubeListInputPopup.style.display = "none";
    }
    else {
        youtubeListInputPopup.style.display = "block";
    }
});
async function scrollToBtm(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, _reject) => {
            let currentHeight = 0;
            let scrollInterval = setInterval(function () {
                let pageBottom = document.documentElement.scrollHeight;
                if (currentHeight < pageBottom) {
                    document.documentElement.scrollTop = document.documentElement.scrollHeight;
                    currentHeight = pageBottom;
                }
                else {
                    clearInterval(scrollInterval);
                    resolve(0);
                }
            }, 700);
        });
    });
}
async function getYoutubeList(url = "https://www.youtube.com/playlist?list=PLC7IbGRZ5AEjMZhKR1p6b_CpOqHWYI2Sj") {
    const mobile = puppeteer.devices["iPhone 6"];
    if (url.includes("app=desktop")) {
        url = url.replace("app=desktop", "");
    }
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.emulate(mobile);
    await page.goto(url);
    await scrollToBtm(page);
    const videos = await page.$eval("#app > div.page-container > ytm-browse > ytm-single-column-browse-results-renderer > div > div > ytm-section-list-renderer > lazy-list > ytm-item-section-renderer > lazy-list > ytm-playlist-video-list-renderer", element => {
        let list = {};
        for (let video of element.childNodes) {
            // @ts-ignore
            const name = video.querySelector("h4").innerText;
            const link = video.querySelector("a").href;
            list[name] = link;
        }
        return list;
    });
    const name = await page.$eval("#app > div.page-container > ytm-browse > ytm-playlist-header-renderer > div.playlist-header > div > div:nth-child(1) > h2", element => { return element.innerHTML; });
    await browser.close();
    return [videos, name];
}
youtubeLinkInput.addEventListener("change", async () => {
    const link = youtubeLinkInput.value;
    youtubeLinkInput.value = "";
    let videos = {};
    let name;
    await getYoutubeList(link)
        .then(res => {
        videos = JSON.parse(JSON.stringify(res[0]));
        name = res[1];
    })
        .catch(err => { alert(err); return 0; });
    addList(videos, name);
});
//# sourceMappingURL=loadYoutubeList.js.map