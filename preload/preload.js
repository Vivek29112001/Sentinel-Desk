const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {

    scanSystem: () => ipcRenderer.invoke("system-scan"),

    getOSStatic: () => ipcRenderer.invoke("os-static"),

    getOSDynamic: () => ipcRenderer.invoke("os-dynamic"),

    getCpuMemoryInfo: () => ipcRenderer.invoke("cpu-memory"),

    getDiskUsage: () => ipcRenderer.invoke("getDiskUsage"),

    networkMonitor: () => ipcRenderer.invoke("network-monitor"),

    antivirusStatus: () => ipcRenderer.invoke("antivirus-status"),

    getADInfo: () => ipcRenderer.invoke("get-ad-info"),

    threatScan: () => ipcRenderer.invoke("threat-scan"),

    // liveScan: () => ipcRenderer.invoke("live-scan"),

    // portScan: (ip) => ipcRenderer.invoke("port-scan", ip),

    liveScan: () => ipcRenderer.invoke("live-scan"),
    deepScan: () => ipcRenderer.invoke("deep-scan"),
    portScan: (ip) => ipcRenderer.invoke("port-scan", ip),
    packetSniff: () => ipcRenderer.invoke("packet-sniff"),
    detectThreats: (devices) => ipcRenderer.invoke("detect-threats", devices),

    startSniff: () => ipcRenderer.send("start-sniff"),

    onSniffData: (callback) =>
        ipcRenderer.on("sniff-data", (_, data) => callback(data)),

    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)

})