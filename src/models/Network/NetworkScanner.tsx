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

export default function NetworkScanner() {

    const [devices, setDevices] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [previousDevices, setPreviousDevices] = useState<any[]>([]);

    const [loadingIP, setLoadingIP] = useState<string | null>(null);
    const [deepLoading, setDeepLoading] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);

    // =====================
    // LIVE SCAN
    // =====================

    const liveScan = async () => {
        if (!window?.electronAPI) return;

        const result = await window.electronAPI.liveScan();
        if (!result) return;

        setDevices(result);

        setPreviousDevices(result);
    };

    // =====================
    // DEEP SCAN
    // =====================

    const deepScan = async () => {
        try {
            setDeepLoading(true);

            const res = await window.electronAPI.deepScan();
            if (!res) return;

            setDevices((prev) =>
                res.map((d: any) => {
                    const old = prev.find((p) => p.ip === d.ip);
                    return { ...old, ...d };
                })
            );

        } finally {
            setDeepLoading(false);
        }
    };

    // =====================
    // PORT SCAN
    // =====================

    const scanPorts = async (ip: string) => {
        setLoadingIP(ip);

        const res = await window.electronAPI.portScan(ip);

        setDevices((prev) =>
            prev.map((d) =>
                d.ip === ip ? { ...d, ports: res?.ports || [] } : d
            )
        );

        setLoadingIP(null);
    };

    useEffect(() => {
        liveScan();
        const i = setInterval(liveScan, 5000);
        return () => clearInterval(i);
    }, []);

    return (
        <div className="space-y-6 p-6">

            <Header deepScan={deepScan} deepLoading={deepLoading} />

            <SummaryCards devices={devices} />

            <TopologySection devices={devices} events={events} />

            <div className="col-span-2">
                <DeviceTable
                    devices={devices}
                    scanPorts={scanPorts}
                    loadingIP={loadingIP}
                    onSelectDevice={setSelectedDevice}
                />
            </div>

            <DeviceDetailsPanel device={selectedDevice} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <TrafficMonitor />
                <TrafficGraph />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ThreatPanel devices={devices} />

            </div>

        </div >
    );
}