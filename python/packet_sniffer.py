from scapy.all import sniff, IP, TCP, UDP
import json

traffic = {}

def process_packet(packet):

    if IP in packet:
        src = packet[IP].src
        dst = packet[IP].dst

        proto = "OTHER"

        if TCP in packet:
            proto = "TCP"
        elif UDP in packet:
            proto = "UDP"

        key = src

        if key not in traffic:
            traffic[key] = {
                "ip": src,
                "bytes": 0,
                "packets": 0,
                "protocols": set()
            }

        traffic[key]["bytes"] += len(packet)
        traffic[key]["packets"] += 1
        traffic[key]["protocols"].add(proto)


def run_sniffer():
    sniff(prn=process_packet, timeout=5)

    result = []

    for k, v in traffic.items():
        result.append({
            "ip": v["ip"],
            "bytes": v["bytes"],
            "packets": v["packets"],
            "protocols": list(v["protocols"])
        })

    print(json.dumps(result))


if __name__ == "__main__":
    run_sniffer()