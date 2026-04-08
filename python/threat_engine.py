import json
import sys

def detect_threats(devices):

    threats = []

    for d in devices:

        ip = d.get("ip")
        ports = d.get("ports", [])
        vendor = d.get("vendor", "Unknown")

        port_list = []

        for p in ports:
            if isinstance(p, dict):
                port_list.append(p.get("port"))
            else:
                port_list.append(p)

        # 🔥 RULES

        if 22 in port_list:
            threats.append({
                "ip": ip,
                "type": "SSH Open",
                "risk": "Medium"
            })

        if 3389 in port_list:
            threats.append({
                "ip": ip,
                "type": "RDP Open",
                "risk": "High"
            })

        if vendor == "Unknown":
            threats.append({
                "ip": ip,
                "type": "Unknown Device",
                "risk": "High"
            })

    return threats


if __name__ == "__main__":

    data = json.loads(sys.stdin.read())

    result = detect_threats(data)

    print(json.dumps(result))