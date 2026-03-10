import psutil
import socket
import json
import time

try:

    # TOTAL DATA
    net_io = psutil.net_io_counters()

    upload_mb = round(net_io.bytes_sent / (1024 ** 2), 2)
    download_mb = round(net_io.bytes_recv / (1024 ** 2), 2)

    # REAL TIME SPEED
    prev = psutil.net_io_counters()
    time.sleep(1)
    now = psutil.net_io_counters()

    upload_speed = (now.bytes_sent - prev.bytes_sent) / 1024
    download_speed = (now.bytes_recv - prev.bytes_recv) / 1024

    upload_kb = round(upload_speed, 2)
    download_kb = round(download_speed, 2)

    # ACTIVE CONNECTIONS
    connections = len(psutil.net_connections())

    # HOST INFO
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)

    # NETWORK INTERFACES
    interfaces = []

    for name, addrs in psutil.net_if_addrs().items():

        for addr in addrs:

            if addr.family == socket.AF_INET and not addr.address.startswith("127"):

                interfaces.append({
                    "interface": name,
                    "ip": addr.address
                })

    data = {
        "ip_address": ip_address,
        "upload_mb": upload_mb,
        "download_mb": download_mb,
        "upload_kb": upload_kb,
        "download_kb": download_kb,
        "connections": connections,
        "interfaces": interfaces
    }

    print(json.dumps(data))

except Exception as e:

    print(json.dumps({
        "error": str(e)
    }))