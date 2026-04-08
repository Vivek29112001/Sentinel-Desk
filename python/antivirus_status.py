import subprocess
import json

try:

    cmd = [
        "powershell",
        "Get-MpComputerStatus | ConvertTo-Json"
    ]

    result = subprocess.check_output(cmd).decode()

    data = json.loads(result)

    antivirus = {
        "name": "Windows Defender",
        "real_time_protection": data["RealTimeProtectionEnabled"],
        "antivirus_enabled": data["AntivirusEnabled"],
        "last_scan": data["QuickScanEndTime"],
        "definitions_updated": data["AntivirusSignatureLastUpdated"]
    }

    print(json.dumps(antivirus))

except Exception as e:

    print(json.dumps({
        "error": str(e)
    }))