import { app, BrowserWindow} from "electron"
app.on("ready", () => {
    let window = new BrowserWindow({
        fullscreen: true,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    window.setMenuBarVisibility(false)
    window.setAspectRatio(16/9)
    
    window.loadFile("index.html")
    window.on("enter-full-screen", () => {
        window.on("leave-full-screen", window.close)
    })
})

app.on("window-all-closed", app.exit)