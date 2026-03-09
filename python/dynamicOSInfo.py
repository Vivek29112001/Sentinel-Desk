import socket
import psutil
import json
from datetime import datetime

try:

    boot_time = datetime.fromtimestamp(psutil.boot_time()).strftime("%Y-%m-%d %H:%M:%S")

    data = {
        "boot_time": boot_time,
        "ip_address": socket.gethostbyname(socket.gethostname())
    }

    print(json.dumps(data))

except Exception as e:

    print(json.dumps({
        "error": str(e)
    }))