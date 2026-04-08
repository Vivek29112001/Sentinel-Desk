"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function TrafficMonitor() {

    const [traffic, setTraffic] = useState<any[]>([]);

    // 🔥 store per interval data
    const trafficMap = useRef<Map<string, any>>(new Map());
    const lastReset = useRef(Date.now());

    useEffect(() => {

        if (!window?.electronAPI) return;

        window.electronAPI.startSniff();

        let buffer = "";

        const handler = (data: any) => {
            try {
                buffer += data.toString();

                const parts = buffer.split("\n");
                buffer = parts.pop() || "";

                parts.forEach((line) => {

                    if (!line.trim()) return;

                    const packet = JSON.parse(line);
                    const ip = packet.ip;

                    const now = Date.now();

                    // 🔥 reset every 2 sec (sliding window)
                    if (now - lastReset.current > 2000) {
                        trafficMap.current.clear();
                        lastReset.current = now;
                    }

                    const existing = trafficMap.current.get(ip) || {
                        ip,
                        packets: 0,
                        bytes: 0,
                        protocols: new Set()
                    };

                    existing.packets += 1;
                    existing.bytes += packet.size || 0;

                    if (packet.proto) {
                        existing.protocols.add(packet.proto);
                    }

                    trafficMap.current.set(ip, existing);
                });

                // 🔥 convert + normalize
                const updated = Array.from(trafficMap.current.values()).map(v => ({
                    ...v,
                    protocols: Array.from(v.protocols || []),
                    kbps: (v.bytes / 1024).toFixed(2)
                }));

                // 🔥 sort by current traffic (NOT total)
                updated.sort((a, b) => b.bytes - a.bytes);

                setTraffic(updated.slice(0, 20));

            } catch (err) {
                console.error("Streaming parse error:", err);
            }
        };

        window.electronAPI.onSniffData(handler);

        return () => {
            window.electronAPI.removeAllListeners?.("sniff-data");
        };

    }, []);

    return (
        <Card className="h-[350px] flex flex-col">

            {/* HEADER */}
            <div className="p-4 border-b font-semibold flex justify-between">
                <span>Live Traffic Monitor</span>
                <span className="text-xs text-gray-500">
                    Real-time (2s window)
                </span>
            </div>

            {/* SCROLL */}
            <CardContent className="p-4 overflow-y-auto flex-1">

                {traffic.length === 0 && (
                    <p className="text-sm text-gray-500">
                        Listening for traffic...
                    </p>
                )}

                {traffic.map((t, i) => {

                    const isTop = i === 0;

                    return (
                        <div
                            key={i}
                            className={`border-b py-2 text-sm ${isTop ? "bg-green-50" : ""
                                }`}
                        >

                            <div className="flex justify-between">

                                <span className="font-medium">
                                    {t.ip} {isTop && "🔥"}
                                </span>

                                <span className="text-xs text-gray-500">
                                    {Array.isArray(t.protocols)
                                        ? t.protocols.join(", ")
                                        : "-"}
                                </span>

                            </div>

                            <div className="text-xs text-gray-500">
                                {t.packets} packets • {t.kbps} KB/s
                            </div>

                        </div>
                    );
                })}

            </CardContent>

        </Card>
    );
}