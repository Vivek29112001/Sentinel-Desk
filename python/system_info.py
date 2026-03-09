import psutil
import platform
import json


processes = []

for p in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
    processes.append({
        "pid": p.info['pid'],
        "name": p.info['name'],
        "cpu_percent": p.info['cpu_percent'],
        "memory_percent": p.info['memory_percent']
    })

data = {

 "os": platform.system(),
 "cpu": psutil.cpu_percent(interval=1),
 "memory": psutil.virtual_memory().percent,
 "disk": psutil.disk_usage('/').percent,
 "process_count": len(psutil.pids()),
 "processes": processes[:10]  # Limiting to top 10 processes for brevity
}

print(json.dumps(data))