import nmap
import sys
import json

def detect_device_type(os_name):
    if not os_name:
        return "Unknown"

    os_name = os_name.lower()

    if "windows" in os_name:
        return "Laptop/PC"
    elif "linux" in os_name:
        return "Server/Router"
    elif "android" in os_name:
        return "Mobile"
    elif "ios" in os_name or "mac" in os_name:
        return "Apple Device"
    else:
        return "Unknown"


def scan_ports(ip):
    scanner = nmap.PortScanner(
        nmap_search_path=("C:\\Program Files (x86)\\Nmap\\nmap.exe",)
    )

    try:
        scanner.scan(ip, arguments="-O -sV -p 1-1000")

        ports = []
        os_name = "Unknown"

        if ip in scanner.all_hosts():

            # PORTS
            for proto in scanner[ip].all_protocols():
                for port in scanner[ip][proto]:
                    state = scanner[ip][proto][port]["state"]
                    service = scanner[ip][proto][port]["name"]

                    if state == "open":
                        ports.append({
                            "port": port,
                            "service": service
                        })

            # OS DETECTION
            if "osmatch" in scanner[ip] and scanner[ip]["osmatch"]:
                os_name = scanner[ip]["osmatch"][0]["name"]

        device_type = detect_device_type(os_name)

        return {
            "ip": ip,
            "ports": ports,
            "os": os_name,
            "device_type": device_type
        }

    except Exception as e:
        return {
            "ip": ip,
            "ports": [],
            "os": "Unknown",
            "device_type": "Unknown"
        }


if __name__ == "__main__":
    ip = sys.argv[1]
    result = scan_ports(ip)
    print(json.dumps(result))


