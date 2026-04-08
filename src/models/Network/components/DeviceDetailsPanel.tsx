"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DeviceDetailsPanel({ device }: any) {

    if (!device) {
        return (
            <Card className="h-full flex items-center justify-center">
                <p className="text-gray-500">Select a device</p>
            </Card>
        );
    }

    const ports = device.ports?.map((p: any) =>
        typeof p === "object" ? `${p.port} (${p.service})` : p
    );

    return (
        <Card className="h-full">

            <CardHeader>
                <CardTitle>Device Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">

                <div><b>IP:</b> {device.ip}</div>
                <div><b>Hostname:</b> {device.hostname || "-"}</div>
                <div><b>MAC:</b> {device.mac || "-"}</div>

                <div>
                    <b>OS:</b>{" "}
                    <Badge variant="secondary">
                        {device.os || "Unknown"}
                    </Badge>
                </div>

                <div><b>Vendor:</b> {device.vendor || "Unknown"}</div>

                <div><b>Device Type:</b> {device.device_type || "-"}</div>

                <div>
                    <b>Ports:</b>
                    <div className="mt-1 text-xs text-gray-600">
                        {ports?.length ? ports.join(", ") : "No open ports"}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}