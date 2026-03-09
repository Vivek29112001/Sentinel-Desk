const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {

    scanSystem: () => ipcRenderer.invoke("system-scan")

})