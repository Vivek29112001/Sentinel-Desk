// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// export default function ThreatPanel({ devices }: any) {

//     const [threats, setThreats] = useState<any[]>([]);

//     const scanThreats = async () => {
//         if (!window?.electronAPI) return;

//         const res = await window.electronAPI.detectThreats(devices);
//         if (!res) return;

//         setThreats(res);
//     };

//     useEffect(() => {
//         scanThreats();
//     }, [devices]);

//     return (
//         <Card>
//             <CardContent className="p-4 space-y-2">

//                 <h2 className="font-bold">Threats</h2>

//                 {threats.map((t, i) => (
//                     <div key={i} className="flex justify-between text-sm">

//                         <span>{t.ip} - {t.type}</span>

//                         <Badge variant={
//                             t.risk === "High" ? "destructive" :
//                                 t.risk === "Medium" ? "secondary" :
//                                     "outline"
//                         }>
//                             {t.risk}
//                         </Badge>

//                     </div>
//                 ))}

//             </CardContent>
//         </Card>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ThreatPanel({ devices }: any) {

    const [threats, setThreats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const scanThreats = async () => {
        try {
            if (!window?.electronAPI) return;
            if (!devices || devices.length === 0) return;

            // 🔥 only run if useful data present
            const hasScanData = devices.some(
                (d: any) => d.ports?.length || d.vendor
            );

            if (!hasScanData) return;

            setLoading(true);

            console.log("Scanning threats with devices:", devices);

            const res = await window.electronAPI.detectThreats(devices);

            console.log("Threat result:", res);

            if (!res) {
                setThreats([]);
                return;
            }

            setThreats(res);

        } catch (err) {
            console.error("Threat scan error:", err);
            setThreats([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        scanThreats();
    }, [devices]);

    return (
        <Card>
            <CardContent className="p-4 space-y-2">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h2 className="font-bold">Threats</h2>

                    {loading && (
                        <span className="text-xs text-gray-500">
                            Scanning...
                        </span>
                    )}
                </div>

                {/* EMPTY STATE */}
                {!loading && threats.length === 0 && (
                    <p className="text-sm text-gray-500">
                        No threats detected
                    </p>
                )}

                {/* LIST */}
                {threats.map((t, i) => (
                    <div
                        key={i}
                        className="flex justify-between text-sm border-b py-1"
                    >

                        <span>
                            {t.ip} - {t.type}
                        </span>

                        <Badge
                            variant={
                                t.risk === "High"
                                    ? "destructive"
                                    : t.risk === "Medium"
                                        ? "secondary"
                                        : "outline"
                            }
                        >
                            {t.risk}
                        </Badge>

                    </div>
                ))}

            </CardContent>
        </Card>
    );
}