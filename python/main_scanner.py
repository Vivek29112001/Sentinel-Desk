import platform
import json

from core.cpu_memory import get_cpu_memory
import core.disk_usage as disk_usage
import core.network_monitor as network_monitor
import core.threat_detector as threat_detector

data = {}

# CORE SCANS
data["cpu_memory"] = get_cpu_memory()

# OS DETECTION
os_name = platform.system()

if os_name == "Windows":

    from os.windows.antivirus import get_antivirus
    from os.windows.ad_scanner import scan_ad

    data["antivirus"] = get_antivirus()
    data["ad"] = scan_ad()

elif os_name == "Linux":

    try:
        from os.linux.antivirus import get_antivirus
        data["antivirus"] = get_antivirus()
    except:
        data["antivirus"] = "not_supported"

elif os_name == "Darwin":

    try:
        from os.mac.antivirus import get_antivirus
        data["antivirus"] = get_antivirus()
    except:
        data["antivirus"] = "not_supported"

print(json.dumps(data))