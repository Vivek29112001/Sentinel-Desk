"use client";

import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DeviceTable({
    devices,
    scanPorts,
    loadingIP,
    onSelectDevice
}: any) {

    const formatPorts = (ports: any[]) => {
        if (!ports || ports.length === 0) return "-";
        return ports.map(p => typeof p === "object" ? p.port : p).join(", ");
    };

    const getRisk = (d: any) => {

        if (!d.vendor || d.vendor === "Unknown") return "high";

        if (d.ports?.some((p: any) => {
            const port = typeof p === "object" ? p.port : p;
            return port === 22 || port === 3389;
        })) return "medium";

        return "safe";
    };

    const getRiskBadge = (risk: string) => {
        if (risk === "high") return <Badge variant="destructive">High</Badge>;
        if (risk === "medium") return <Badge className="bg-yellow-500">Medium</Badge>;
        return <Badge className="bg-green-600">Safe</Badge>;
    };

    return (
        <Card>

            <CardHeader>
                <CardTitle className="flex justify-between">
                    Devices
                    <Badge variant="outline">{devices.length}</Badge>
                </CardTitle>
            </CardHeader>

            <CardContent>

                <Table>

                    <TableHeader>
                        <TableRow>
                            <TableHead>IP</TableHead>
                            <TableHead>OS</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Risk</TableHead>
                            <TableHead>Ports</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>

                        {devices.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    No devices found
                                </TableCell>
                            </TableRow>
                        )}

                        {devices.map((d: any, i: number) => {

                            const risk = getRisk(d);
                            const isLoading = loadingIP === d.ip;

                            return (
                                <TableRow
                                    key={i}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onSelectDevice(d)}
                                >

                                    <TableCell>{d.ip}</TableCell>

                                    <TableCell>
                                        <Badge variant="secondary">
                                            {d.os || "Unknown"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        {d.vendor || "Unknown"}
                                    </TableCell>

                                    <TableCell>
                                        {getRiskBadge(risk)}
                                    </TableCell>

                                    <TableCell>
                                        {formatPorts(d.ports)}
                                    </TableCell>

                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            size="sm"
                                            onClick={() => scanPorts(d.ip)}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Scanning..." : "Scan Ports"}
                                        </Button>
                                    </TableCell>

                                </TableRow>
                            );
                        })}

                    </TableBody>
                </Table>

            </CardContent>
        </Card>
    );
}