# import nmap
# import json
# import socket

# def get_hostname(ip):
#     try:
#         return socket.gethostbyaddr(ip)[0]
#     except:
#         return ""

# def scan():

#     scanner = nmap.PortScanner()

#     # 🔥 AUTO NETWORK DETECT (NO HARDCODE)
#     local_ip = socket.gethostbyname(socket.gethostname())
#     base_ip = ".".join(local_ip.split(".")[:-1]) + ".0/24"

#     scanner.scan(hosts=base_ip, arguments="-sn")

#     devices = []

#     for host in scanner.all_hosts():

#         ip = host
#         hostname = get_hostname(ip)

#         mac = ""
#         if "addresses" in scanner[host]:
#             mac = scanner[host]["addresses"].get("mac", "")

#         devices.append({
#             "ip": ip,
#             "hostname": hostname,
#             "mac": mac,
#             "status": scanner[host].state()
#         })

#     print(json.dumps(devices))


# if __name__ == "__main__":
#     scan()


# import nmap
# import json
# import socket

# def get_network():
#     hostname = socket.gethostname()
#     local_ip = socket.gethostbyname(hostname)
#     base_ip = ".".join(local_ip.split(".")[:-1]) + ".0/24"
#     print(f"Scanning network: {base_ip}")
#     return base_ip

# def scan():

#     scanner = nmap.PortScanner()

#     network = get_network()

#     # 🔥 ARP + Ping scan (better detection)
#     scanner.scan(hosts=network, arguments="-sn -PR")

#     devices = []

#     for host in scanner.all_hosts():

#         mac = ""
#         vendor = ""

#         if "addresses" in scanner[host]:
#             mac = scanner[host]["addresses"].get("mac", "")

#         if "vendor" in scanner[host]:
#             vendor = list(scanner[host]["vendor"].values())[0] if scanner[host]["vendor"] else ""

#         devices.append({
#             "ip": host,
#             "mac": mac,
#             "vendor": vendor,
#             "status": scanner[host].state()
#         })

#     print(json.dumps(devices))

# if __name__ == "__main__":
#     scan()


import nmap
import json
import psutil
import socket

def get_network():

    interfaces = psutil.net_if_addrs()

    for iface, addrs in interfaces.items():

        for addr in addrs:

            if addr.family == socket.AF_INET:

                ip = addr.address

                if ip.startswith("127.") or ip.startswith("169.254"):
                    continue

                if ip.startswith(("192.", "10.", "172.")):
                    return ".".join(ip.split(".")[:-1]) + ".0/24"

    return "192.168.1.0/24"


def scan():

    scanner = nmap.PortScanner()

    network = get_network()

    # 🔥 BEST detection combo
    scanner.scan(hosts=network, arguments="-sn -PR")

    devices = []

    for host in scanner.all_hosts():

        mac = ""
        vendor = ""

        if "addresses" in scanner[host]:
            mac = scanner[host]["addresses"].get("mac", "")

        if "vendor" in scanner[host]:
            vendor = list(scanner[host]["vendor"].values())[0] if scanner[host]["vendor"] else ""

        devices.append({
            "ip": host,
            "mac": mac,
            "vendor": vendor,
            "status": scanner[host].state()
        })

    print(json.dumps(devices))


if __name__ == "__main__":
    scan()