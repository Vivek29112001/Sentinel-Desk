"use client";

import { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export default function TrafficGraph() {

    const [data, setData] = useState<any[]>([]);

    const updateGraph = async () => {
        if (!window?.electronAPI) return;

        const res = await window.electronAPI.packetSniff();
        if (!res) return;

        const totalBytes = res.reduce((acc: number, d: any) => acc + d.bytes, 0);

        setData(prev => [
            ...prev.slice(-20),
            {
                time: new Date().toLocaleTimeString(),
                bytes: totalBytes
            }
        ]);
    };

    useEffect(() => {
        const i = setInterval(updateGraph, 3000);
        return () => clearInterval(i);
    }, []);

    return (
        <Card className="h-[300px]">

            <CardContent className="p-4 h-full">

                <h2 className="font-semibold mb-2">
                    Network Traffic (Live)
                </h2>

                <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={data}>
                        <XAxis dataKey="time" hide />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="bytes" stroke="#2563eb" />
                    </LineChart>
                </ResponsiveContainer>

            </CardContent>

        </Card>
    );
}