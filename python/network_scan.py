import subprocess
import json
import socket
import sys
import re

mode = "live"
if len(sys.argv) > 1:
    mode = sys.argv[1]

hostname = socket.gethostname()
ip = socket.gethostbyname(hostname)
network = ".".join(ip.split(".")[:3]) + ".0/24"

nmap_path = "C:\\Program Files (x86)\\Nmap\\nmap.exe"

# Lightweight scan
if mode == "live":
    args = [nmap_path, "-sn", network]

# Deep scan
else:
    args = [nmap_path, "-O", "-sT", "-sV", "--open", network]

result = subprocess.run(args, capture_output=True, text=True)

lines = result.stdout.split("\n")

devices = []
current = None

for line in lines:

    if "Nmap scan report for" in line:

        if current:
            devices.append(current)

        ip_match = re.search(r"\((.*?)\)", line)

        if ip_match:
            ip_addr = ip_match.group(1)
            hostname = line.split("for")[1].split("(")[0].strip()
        else:
            ip_addr = line.split("for")[1].strip()
            hostname = ""

        current = {
            "hostname": hostname,
            "ip": ip_addr,
            "mac": "",
            "vendor": "",
            "os": "Unknown",
            "ports": [],
            "latency": ""
        }

    elif "MAC Address:" in line and current:
        parts = line.split()
        current["mac"] = parts[2]
        current["vendor"] = " ".join(parts[3:]).replace("(", "").replace(")", "")

    elif "open" in line and "/tcp" in line and current:
        port = line.split("/")[0]
        service = line.split()[-1]

        current["ports"].append({
            "port": port,
            "service": service
        })

    elif "Running:" in line and current:
        current["os"] = line.replace("Running:", "").strip()

    elif "Host is up" in line and current:
        latency = re.search(r"\((.*?)\)", line)
        if latency:
            current["latency"] = latency.group(1)

if current:
    devices.append(current)

print(json.dumps(devices))