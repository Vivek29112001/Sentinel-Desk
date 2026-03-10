const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const { spawn } = require("child_process")

let win

function createWindow() {

    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "../preload/preload.js"), contextIsolation: true,
            nodeIntegration: false
        }
    })

    // Next.js dev server
    win.loadURL("http://localhost:3000")

    // debugging ke liye
    win.webContents.openDevTools()

}

app.whenReady().then(() => {

    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})


// =============================
// SAFE PYTHON RUNNER
// =============================

function runPython(file) {

    return new Promise((resolve) => {

        const pythonFile = path.resolve(file)

        const py = spawn("python3", [pythonFile], { shell: true })

        let data = ""
        let error = ""

        py.stdout.on("data", (chunk) => {
            data += chunk.toString()
        })

        py.stderr.on("data", (chunk) => {
            error += chunk.toString()
        })

        py.on("close", (code) => {

            if (error) {
                console.error("Python Error:", error)
                resolve(null)
                return
            }

            if (!data) {
                console.error("Python returned empty output")
                resolve(null)
                return
            }

            try {

                const parsed = JSON.parse(data)
                resolve(parsed)

            } catch (err) {

                console.error("JSON Parse Error:", data)
                resolve(null)

            }

        })

    })

}


ipcMain.handle("system-scan", async () => {

    const file = path.join(__dirname, "../python/cpu_memory.py")

    return await runPython(file)

})

ipcMain.handle("os-static", async () => {

    const file = path.join(__dirname, "../python/staticOSInfo.py")

    return await runPython(file)

})

ipcMain.handle("os-dynamic", async () => {

    const file = path.join(__dirname, "../python/dynamicOSInfo.py")

    return await runPython(file)

})

ipcMain.handle("getDiskUsage", async () => {

    const file = path.join(__dirname, "../python/disk_usage.py")

    return await runPython(file)

})

ipcMain.handle("network-monitor", async () => {

    const file = path.join(__dirname, "../python/network_monitor.py")

    return await runPython(file)

})

ipcMain.handle("antivirus-status", async () => {

    const file = path.join(__dirname, "../python/antivirus_status.py")

    return await runPython(file)

})

ipcMain.handle("get-ad-info", async () => {

    const file = path.join(__dirname, "../python/ad_scanner.py")

    return await runPython(file)

})

ipcMain.handle("threat-scan", async () => {

    const file = path.join(__dirname, "../python/threat_detector.py")

    return await runPython(file)

})