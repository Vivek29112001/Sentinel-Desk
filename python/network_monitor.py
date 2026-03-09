import psutil
import socket
import json

try:

    net_io = psutil.net_io_counters()

    upload_mb = round(net_io.bytes_sent / (1024**2),2)
    download_mb = round(net_io.bytes_recv / (1024**2),2)

    connections = len(psutil.net_connections())

    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)

    interfaces = []

    for name,addrs in psutil.net_if_addrs().items():

        for addr in addrs:

            if addr.family == socket.AF_INET:

                interfaces.append({
                    "interface":name,
                    "ip":addr.address
                })


    data = {
        "ip_address":ip_address,
        "upload_mb":upload_mb,
        "download_mb":download_mb,
        "connections":connections,
        "interfaces":interfaces
    }

    print(json.dumps(data))

except Exception as e:

    print(json.dumps({
        "error":str(e)
    }))