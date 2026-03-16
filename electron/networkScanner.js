const path = require("path")
const { spawn } = require("child_process")

function runNetworkScan(mode = "live", callback) {

    const script = path.join(__dirname, "../python/network_scan.py")

    const python = spawn("python", [script, mode])

    let data = ""

    python.stdout.on("data", (chunk) => {
        data += chunk.toString()
    })

    python.stderr.on("data", (err) => {
        console.log("Python error:", err.toString())
    })

    python.on("close", () => {
        try {
            const devices = JSON.parse(data)
            callback(devices)
        } catch (err) {
            console.log("Parse error:", data)
        }
    })
}

module.exports = { runNetworkScan }