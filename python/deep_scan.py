# import nmap
# import json

# scanner = nmap.PortScanner()

# scanner.scan("192.168.1.0/24", arguments="-O -sV --open")

# devices = []

# def detect_type(os):
#     if not os:
#         return "Unknown"

#     os = os.lower()

#     if "windows" in os or "linux" in os:
#         return "Laptop/PC"
#     if "android" in os or "ios" in os:
#         return "Mobile"
#     if "router" in os:
#         return "Router"

#     return "Unknown"

# for host in scanner.all_hosts():

#     os_name = ""
#     ports = []

#     if "osmatch" in scanner[host] and scanner[host]["osmatch"]:
#         os_name = scanner[host]["osmatch"][0]["name"]

#     if "tcp" in scanner[host]:
#         ports = list(scanner[host]["tcp"].keys())

#     mac = scanner[host]["addresses"].get("mac", "")

#     devices.append({
#         "ip": host,
#         "mac": mac,
#         "os": os_name,
#         "device_type": detect_type(os_name),
#         "ports": ports
#     })

# print(json.dumps(devices))

# import nmap
# import json
# import socket

# def get_network():
#     hostname = socket.gethostname()
#     local_ip = socket.gethostbyname(hostname)
#     base_ip = ".".join(local_ip.split(".")[:-1]) + ".0/24"
#     return base_ip

# def detect_type(os):
#     if not os:
#         return "Unknown"

#     os = os.lower()

#     if "windows" in os:
#         return "Laptop/PC"
#     if "linux" in os:
#         return "Server"
#     if "android" in os:
#         return "Mobile"
#     if "ios" in os or "mac" in os:
#         return "Apple"
#     return "Unknown"

# def scan():

#     scanner = nmap.PortScanner()
#     network = get_network()

#     scanner.scan(network, arguments="-O -sV --open")

#     devices = []

#     for host in scanner.all_hosts():

#         os_name = ""
#         ports = []

#         if "osmatch" in scanner[host] and scanner[host]["osmatch"]:
#             os_name = scanner[host]["osmatch"][0]["name"]

#         if "tcp" in scanner[host]:
#             ports = list(scanner[host]["tcp"].keys())

#         devices.append({
#             "ip": host,
#             "os": os_name,
#             "device_type": detect_type(os_name),
#             "ports": ports
#         })

#     print(json.dumps(devices))

# if __name__ == "__main__":
#     scan()


import nmap
import json
import psutil
import socket

# =========================
# GET ALL NETWORKS (FIXED)
# =========================

def get_all_networks():

    networks = set()

    interfaces = psutil.net_if_addrs()

    for iface, addrs in interfaces.items():

        for addr in addrs:

            if addr.family == socket.AF_INET:

                ip = addr.address

                # skip loopback / invalid
                if ip.startswith("127.") or ip.startswith("169.254"):
                    continue

                # only private networks
                if ip.startswith(("192.", "10.", "172.")):
                    base = ".".join(ip.split(".")[:-1]) + ".0/24"
                    networks.add(base)

    return list(networks)


# =========================
# DEVICE TYPE DETECTION
# =========================

def detect_type(os):
    if not os:
        return "Unknown"

    os = os.lower()

    if "windows" in os:
        return "Laptop/PC"
    elif "linux" in os:
        return "Server/Router"
    elif "android" in os:
        return "Mobile"
    elif "ios" in os or "mac" in os:
        return "Apple Device"
    return "Unknown"


# =========================
# DEEP SCAN
# =========================

def scan():

    scanner = nmap.PortScanner()

    networks = get_all_networks()

    devices_map = {}   # 🔥 duplicate remove

    for network in networks:

        try:
            scanner.scan(hosts=network, arguments="-O -sV --open")

            for host in scanner.all_hosts():

                os_name = ""
                ports = []
                mac = ""

                if "osmatch" in scanner[host] and scanner[host]["osmatch"]:
                    os_name = scanner[host]["osmatch"][0]["name"]

                if "tcp" in scanner[host]:
                    ports = list(scanner[host]["tcp"].keys())

                if "addresses" in scanner[host]:
                    mac = scanner[host]["addresses"].get("mac", "")

                devices_map[host] = {
                    "ip": host,
                    "mac": mac,
                    "os": os_name,
                    "device_type": detect_type(os_name),
                    "ports": ports
                }

        except Exception as e:
            continue

    # 🔥 convert to list
    devices = list(devices_map.values())

    print(json.dumps(devices))


if __name__ == "__main__":
    scan()