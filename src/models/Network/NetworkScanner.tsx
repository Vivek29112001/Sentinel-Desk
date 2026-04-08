"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import TopologySection from "./components/TopologySection";
import DeviceTable from "./components/DeviceTable";
import DeviceDetailsPanel from "./components/DeviceDetailsPanel";
import TrafficMonitor from "./components/TrafficMonitor";
import ThreatPanel from "./components/ThreatPanel";
import TrafficGraph from "./components/TrafficGraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NetworkScanner() {

    // =====================
    // MODE (🔥 MAIN CONTROL)
    // =====================
    const [mode, setMode] = useState<"live" | "deep" | "compare">("live");

    // =====================
    // DATA
    // =====================
    const [liveDevices, setLiveDevices] = useState<any[]>([]);
    const [deepDevices, setDeepDevices] = useState<any[]>([]);

    const [events, setEvents] = useState<any[]>([]);
    const [previousDevices, setPreviousDevices] = useState<any[]>([]);

    const [loadingIP, setLoadingIP] = useState<string | null>(null);
    const [deepLoading, setDeepLoading] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<any>(null);

    // =====================
    // LIVE SCAN
    // =====================
    const liveScan = async () => {
        try {
            if (!window?.electronAPI) return;
            if (mode !== "live") return;

            const result = await window.electronAPI.liveScan();
            if (!result) return;

            setLiveDevices(result);

            // 🔥 join/leave detection
            const joined = result.filter(
                (n: any) => !previousDevices.some((o) => o.ip === n.ip)
            );

            const left = previousDevices.filter(
                (o: any) => !result.some((n: any) => n.ip === o.ip)
            );

            const newEvents: any[] = [];

            joined.forEach((d: any) =>
                newEvents.push({
                    type: "join",
                    device: d,
                    time: new Date().toLocaleTimeString(),
                })
            );

            left.forEach((d: any) =>
                newEvents.push({
                    type: "leave",
                    device: d,
                    time: new Date().toLocaleTimeString(),
                })
            );

            if (newEvents.length) {
                setEvents((prev) => [...newEvents, ...prev].slice(0, 20));
            }

            setPreviousDevices(result);

        } catch (err) {
            console.error("Live scan error:", err);
        }
    };

    // =====================
    // DEEP SCAN
    // =====================
    const deepScan = async () => {
        try {
            setDeepLoading(true);

            const res = await window.electronAPI.deepScan();
            if (!res) return;

            setDeepDevices(res);

            // 🔥 auto switch to deep
            setMode("deep");

        } catch (err) {
            console.error("Deep scan error:", err);
        } finally {
            setDeepLoading(false);
        }
    };

    // =====================
    // PORT SCAN
    // =====================
    const scanPorts = async (ip: string) => {
        try {
            setLoadingIP(ip);

            const res = await window.electronAPI.portScan(ip);
            if (!res) return;

            const update = (prev: any[]) =>
                prev.map((d) =>
                    d.ip === ip ? { ...d, ports: res?.ports || [] } : d
                );

            mode === "live"
                ? setLiveDevices(update)
                : setDeepDevices(update);

        } catch (err) {
            console.error("Port scan error:", err);
        } finally {
            setLoadingIP(null);
        }
    };

    // =====================
    // AUTO LIVE SCAN
    // =====================
    useEffect(() => {
        if (mode === "live") {
            liveScan();
            const i = setInterval(liveScan, 5000);
            return () => clearInterval(i);
        }
    }, [mode]);

    // =====================
    // STORE DATA (FOR COMPARE)
    // =====================
    useEffect(() => {
        localStorage.setItem("liveDevices", JSON.stringify(liveDevices));
    }, [liveDevices]);

    useEffect(() => {
        localStorage.setItem("deepDevices", JSON.stringify(deepDevices));
    }, [deepDevices]);

    // =====================
    // COMPARE LOGIC
    // =====================
    const compareDevices = () => {

        const changes: any[] = [];
        const deepMap = new Map(deepDevices.map(d => [d.ip, d]));

        liveDevices.forEach((l) => {
            const d = deepMap.get(l.ip);

            if (!d) {
                changes.push({ type: "NEW_DEVICE", ip: l.ip });
                return;
            }

            const livePorts = l.ports || [];
            const deepPorts = d.ports || [];

            const newPorts = livePorts.filter(p => !deepPorts.includes(p));

            if (newPorts.length) {
                changes.push({
                    type: "NEW_PORT",
                    ip: l.ip,
                    ports: newPorts
                });
            }

            if (l.os && d.os && l.os !== d.os) {
                changes.push({
                    type: "OS_CHANGED",
                    ip: l.ip,
                    from: d.os,
                    to: l.os
                });
            }
        });

        return changes;
    };

    // =====================
    // UI
    // =====================
    return (
        <div className="space-y-6 p-6">

            <Header deepScan={deepScan} deepLoading={deepLoading} />

            {/* 🔥 MODE SWITCH */}
            <div className="flex gap-2">

                <Button
                    variant={mode === "live" ? "default" : "outline"}
                    onClick={() => setMode("live")}
                >
                    🔄 Live
                </Button>

                <Button
                    variant={mode === "deep" ? "default" : "outline"}
                    onClick={() => setMode("deep")}
                >
                    ⚡ Deep
                </Button>

                <Button
                    variant={mode === "compare" ? "default" : "outline"}
                    onClick={() => setMode("compare")}
                >
                    🔍 Compare
                </Button>

                <Badge>
                    {mode.toUpperCase()}
                </Badge>

            </div>

            {/* LOADING */}
            {deepLoading && (
                <div className="p-3 bg-yellow-100 rounded">
                    ⚡ Running deep scan...
                </div>
            )}

            {/* =====================
                LIVE UI
            ===================== */}
            {mode === "live" && (
                <>
                    <SummaryCards devices={liveDevices} />
                    <TopologySection devices={liveDevices} events={events} />

                    <DeviceTable
                        devices={liveDevices}
                        scanPorts={scanPorts}
                        loadingIP={loadingIP}
                        onSelectDevice={setSelectedDevice}
                    />

                    <DeviceDetailsPanel device={selectedDevice} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TrafficMonitor />
                        <TrafficGraph />
                    </div>

                    <ThreatPanel devices={liveDevices} />
                </>
            )}

            {/* =====================
                DEEP UI
            ===================== */}
            {mode === "deep" && (
                <>
                    <SummaryCards devices={deepDevices} />

                    <DeviceTable
                        devices={deepDevices}
                        scanPorts={scanPorts}
                        loadingIP={loadingIP}
                        onSelectDevice={setSelectedDevice}
                    />

                    <DeviceDetailsPanel device={selectedDevice} />

                    <ThreatPanel devices={deepDevices} />
                </>
            )}

            {/* =====================
                COMPARE UI
            ===================== */}
            {mode === "compare" && (
                <div className="space-y-4">

                    <h2 className="text-lg font-bold">
                        🔍 Live vs Deep Comparison
                    </h2>

                    {compareDevices().length === 0 && (
                        <p>No changes detected</p>
                    )}

                    {compareDevices().map((c, i) => (
                        <div
                            key={i}
                            className="p-3 border rounded flex justify-between"
                        >
                            <span>
                                {c.type === "NEW_DEVICE" && `🟢 New Device: ${c.ip}`}
                                {c.type === "NEW_PORT" && `⚡ New Ports: ${c.ip} → ${c.ports.join(", ")}`}
                                {c.type === "OS_CHANGED" && `🧠 OS Changed: ${c.ip}`}
                            </span>

                            <Badge>{c.type}</Badge>
                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}