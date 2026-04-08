"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ThreatPanel({ devices }: any) {

    const [threats, setThreats] = useState<any[]>([]);

    const scanThreats = async () => {
        if (!window?.electronAPI) return;

        const res = await window.electronAPI.detectThreats(devices);
        if (!res) return;

        setThreats(res);
    };

    useEffect(() => {
        scanThreats();
    }, [devices]);

    return (
        <Card>
            <CardContent className="p-4 space-y-2">

                <h2 className="font-bold">Threats</h2>

                {threats.map((t, i) => (
                    <div key={i} className="flex justify-between text-sm">

                        <span>{t.ip} - {t.type}</span>

                        <Badge variant={
                            t.risk === "High" ? "destructive" :
                                t.risk === "Medium" ? "secondary" :
                                    "outline"
                        }>
                            {t.risk}
                        </Badge>

                    </div>
                ))}

            </CardContent>
        </Card>
    );
}