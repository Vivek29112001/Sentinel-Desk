import psutil
import json

suspicious_keywords = [
    "miner","crypto","hack","keylogger","stealer","rat","trojan"
]

threats = []

for p in psutil.process_iter(['pid','name','cpu_percent','memory_percent']):

    try:

        name = p.info['name'] or ""
        cpu = p.info['cpu_percent'] or 0
        memory = p.info['memory_percent'] or 0

        if cpu > 70:
            threats.append({
                "pid":p.pid,
                "name":name,
                "reason":"High CPU usage"
            })

        if memory > 30:
            threats.append({
                "pid":p.pid,
                "name":name,
                "reason":"High Memory usage"
            })

        for key in suspicious_keywords:
            if key in name.lower():

                threats.append({
                    "pid":p.pid,
                    "name":name,
                    "reason":"Suspicious name"
                })

    except:
        pass

print(json.dumps({
    "threats":threats
}))