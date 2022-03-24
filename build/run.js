"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.app.on("ready", () => {
    let window = new electron_1.BrowserWindow({
        fullscreen: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    });
    window.setMenuBarVisibility(false);
    window.setAspectRatio(16 / 9);
    require('@electron/remote/main').initialize();
    require("@electron/remote/main").enable(window.webContents);
    window.loadFile("index.html");
    window.on("enter-full-screen", () => {
        window.on("leave-full-screen", window.close);
    });
});
electron_1.app.on("window-all-closed", electron_1.app.exit);
//# sourceMappingURL=run.js.map