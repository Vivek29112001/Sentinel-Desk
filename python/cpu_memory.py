import psutil
import json

def get_cpu_memory():
    
    cpu_usage = psutil.cpu_percent(interval=1)
    
    memory = psutil.virtual_memory()
    
    processes = []
    
    for p in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
        try:
            processes.append({
                "pid": p.info["pid"],
                "name": p.info["name"],
                "cpu_percent": p.info["cpu_percent"],
                "memory_percent": p.info["memory_percent"]
            })
        except:
            pass
        
    processes = sorted(processes, key=lambda x: x["cpu_percent"], reverse=True)[:5]
    
    data ={
        "cpu": cpu_usage,
        "memory": memory.percent,
        "processes": processes
    }
    
    return data


if __name__ == "__main__":
    print(json.dumps(get_cpu_memory()))