import platform
import socket
import uuid
import psutil
import json
import getpass

try:

    data = {
        "os_name": platform.system(),
        "os_version": platform.version(),
        "hostname": socket.gethostname(),
        "username": getpass.getuser(),
        "architecture": platform.machine(),
        "cpu_model": platform.processor(),
        "cpu_cores": psutil.cpu_count(logical=True),
        "ram_total_gb": round(psutil.virtual_memory().total / (1024**3),2),
        "mac_address": ':'.join(['{:02x}'.format((uuid.getnode() >> elements) & 0xff)
                  for elements in range(0,2*6,2)][::-1])
    }

    print(json.dumps(data))

except Exception as e:

    print(json.dumps({
        "error": str(e)
    }))