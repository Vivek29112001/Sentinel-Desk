import psutil
import json

try:

    disks = []

    for part in psutil.disk_partitions():

        usage = psutil.disk_usage(part.mountpoint)

        disks.append({
            "device": part.device,
            "total_gb": round(usage.total / (1024**3),2),
            "used_gb": round(usage.used / (1024**3),2),
            "free_gb": round(usage.free / (1024**3),2),
            "percent": usage.percent
        })


    io = psutil.disk_io_counters()

    disk_io = {
        "read_mb": round(io.read_bytes/(1024**2),2),
        "write_mb": round(io.write_bytes/(1024**2),2)
    }


    processes = []

    for p in psutil.process_iter(['pid','name','io_counters']):

        try:

            io = p.info['io_counters']

            if io:

                processes.append({
                    "pid": p.info['pid'],
                    "name": p.info['name'],
                    "read_mb": round(io.read_bytes/(1024**2),2),
                    "write_mb": round(io.write_bytes/(1024**2),2)
                })

        except:
            pass


    processes = sorted(
        processes,
        key=lambda x: x["read_mb"]+x["write_mb"],
        reverse=True
    )[:5]


    print(json.dumps({
        "disks":disks,
        "disk_io":disk_io,
        "top_processes":processes
    }))

except Exception as e:

    print(json.dumps({
        "error":str(e)
    }))