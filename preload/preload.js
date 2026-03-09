const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {

    scanSystem: () => ipcRenderer.invoke("system-scan"),

    getOSStatic: () => ipcRenderer.invoke("os-static"),

    getOSDynamic: () => ipcRenderer.invoke("os-dynamic"),

    getCpuMemoryInfo: () => ipcRenderer.invoke("cpu-memory"),

    getDiskUsage: () => ipcRenderer.invoke("getDiskUsage"),

    networkMonitor: () => ipcRenderer.invoke("network-monitor"),

    antivirusStatus: () => ipcRenderer.invoke("antivirus-status")
})