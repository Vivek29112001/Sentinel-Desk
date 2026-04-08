from scapy.all import sniff, IP, TCP, UDP
import json, sys

def process(packet):

    if IP in packet:

        proto = "IP"

        if TCP in packet:
            proto = "TCP"
        elif UDP in packet:
            proto = "UDP"

        data = {
            "ip": packet[IP].src,
            "size": len(packet),
            "proto": proto
        }

        print(json.dumps(data), flush=True)

sniff(prn=process, store=False)