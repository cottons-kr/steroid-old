import { app, BrowserWindow, Tray} from "electron"

let window: BrowserWindow
app.on("ready", () => {
    window = new BrowserWindow({
        width: 1600,
        height: 900,
        minWidth: 1280,
        icon: __dirname+"/asset/icon.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    })
    window.setAspectRatio(16/9)
    window.setMenuBarVisibility(false)
    require('@electron/remote/main').initialize()
    require("@electron/remote/main").enable(window.webContents)
    
    window.loadFile("index.html")
    window.on("close", (e) => { e.preventDefault(); window.minimize() })
})
