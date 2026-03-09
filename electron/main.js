const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const { spawn } = require("child_process")

let win

function createWindow() {

    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "../preload/preload.js"),
            contextIsolation: true
        }
    })

    win.loadURL("http://localhost:3000")
}

app.whenReady().then(createWindow)

ipcMain.handle("system-scan", async () => {

    return new Promise((resolve) => {

        const py = spawn("python", [
            path.join(__dirname, "../python/system_info.py")
        ])

        let data = ""

        py.stdout.on("data", chunk => {
            data += chunk.toString()
        })

        py.on("close", () => {
            resolve(JSON.parse(data))
        })

    })

})