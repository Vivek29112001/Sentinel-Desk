"use client";

import { useEffect, useState } from "react";
import { compareDevices } from "./compareDevices";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ComparePage() {

    const [changes, setChanges] = useState<any[]>([]);

    useEffect(() => {
        const live = JSON.parse(localStorage.getItem("liveDevices") || "[]");
        const deep = JSON.parse(localStorage.getItem("deepDevices") || "[]");

        const result = compareDevices(live, deep);
        setChanges(result);
    }, []);

    return (
        <div className="p-6 space-y-4">

            <h1 className="text-xl font-bold">
                🔍 Live vs Deep Comparison
            </h1>

            {changes.length === 0 && (
                <p>No changes detected</p>
            )}

            {changes.map((c, i) => (
                <Card key={i}>
                    <CardContent className="p-3 flex justify-between">

                        <span>
                            {c.type === "NEW_DEVICE" && `🟢 New Device: ${c.ip}`}
                            {c.type === "NEW_PORT" && `⚡ New Ports: ${c.ip} → ${c.ports.join(", ")}`}
                            {c.type === "OS_CHANGED" && `🧠 OS Changed: ${c.ip}`}
                        </span>

                        <Badge>{c.type}</Badge>

                    </CardContent>
                </Card>
            ))}

        </div>
    );
}