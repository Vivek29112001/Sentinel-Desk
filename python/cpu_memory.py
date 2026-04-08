import psutil
import json

def get_cpu_memory():

    cpu_usage = psutil.cpu_percent(interval=1)

    memory = psutil.virtual_memory()

    processes = []

    # initialize cpu counters
    for p in psutil.process_iter():
        try:
            p.cpu_percent(None)
        except:
            pass

    for p in psutil.process_iter([
        'pid',
        'name',
        'cpu_percent',
        'memory_percent',
        'memory_info',
        'username'
    ]):

        try:

            name = p.info['name'] or "Unknown"

            cpu = p.cpu_percent(interval=None)

            mem_percent = p.info['memory_percent']

            mem_mb = round(p.info['memory_info'].rss / (1024*1024),2)

            user = p.info['username']

            processes.append({

                "pid": p.info["pid"],
                "name": name,
                "cpu_percent": cpu,
                "memory_percent": mem_percent,
                "memory_mb": mem_mb,
                "user": user

            })

        except:
            pass


    # top cpu processes
    processes = sorted(
        processes,
        key=lambda x: x["cpu_percent"],
        reverse=True
    )[:10]


    data = {

        "cpu": cpu_usage,
        "memory": memory.percent,
        "total_ram_gb": round(memory.total/(1024**3),2),
        "used_ram_gb": round(memory.used/(1024**3),2),

        "processes": processes

    }

    return data


if __name__ == "__main__":
    print(json.dumps(get_cpu_memory()))