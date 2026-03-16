"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wifi, ScanLine } from "lucide-react";

import NetworkTopology from "../components/network-topology";

type Device = {
  ip: string;
  hostname?: string;
  mac?: string;
  vendor?: string;
  os?: string;
  latency?: string;
  ports?: { port: string; service: string }[];
};

type Event = {
  type: "join" | "leave";
  device: Device;
  time: string;
};

function detectSuspicious(devices: Device[]) {
  return devices.filter((d) => {
    const unknownVendor = !d.vendor || d.vendor === "Unknown";
    const unknownOS = !d.os || d.os === "Unknown";
    const tooManyPorts = d.ports && d.ports.length > 6;

    return unknownVendor || unknownOS || tooManyPorts;
  });
}

function detectNetworkChanges(oldDevices: Device[], newDevices: Device[]) {
  const joined = newDevices.filter(
    (n) => !oldDevices.some((o) => o.ip === n.ip),
  );

  const left = oldDevices.filter((o) => !newDevices.some((n) => n.ip === o.ip));

  return { joined, left };
}

export default function NetworkScanner() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Device[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [previousDevices, setPreviousDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  const scan = async (mode: "live" | "deep" = "live") => {
    try {
      if (!window?.electronAPI) return;

      if (mode === "deep") setLoading(true);

      const result = await window.electronAPI.networkScan(mode);

      const deviceData: Device[] = result || [];

      setDevices(deviceData);

      const suspicious = detectSuspicious(deviceData);
      setAlerts(suspicious);

      const changes = detectNetworkChanges(previousDevices, deviceData);

      const newEvents: Event[] = [];

      changes.joined.forEach((d) => {
        newEvents.push({
          type: "join",
          device: d,
          time: new Date().toLocaleTimeString(),
        });
      });

      changes.left.forEach((d) => {
        newEvents.push({
          type: "leave",
          device: d,
          time: new Date().toLocaleTimeString(),
        });
      });

      if (newEvents.length) {
        setEvents((prev) => [...newEvents, ...prev].slice(0, 20));
      }

      setPreviousDevices(deviceData);
    } catch (err) {
      console.error("Scan error:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    scan("live");

    const interval = setInterval(() => {
      scan("live");
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 p-6 w-full overflow-x-hidden">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Wifi size={20} />
          Network Scanner
        </h1>

        <Button
          onClick={() => scan("deep")}
          disabled={loading}
          className="shadow-sm"
        >
          <ScanLine size={16} className="mr-2" />
          {loading ? "Deep Scanning..." : "Deep Scan"}
        </Button>
      </div>

      {/* TOPOLOGY + EVENTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {" "}
        {/* LEFT COLUMN → TOPOLOGY */}
        <div className="flex flex-col">
          <Card className="overflow-hidden h-[300px]">
            <CardHeader className="px-4 py-3 border-b bg-muted/40">
              <CardTitle className="text-sm font-semibold">
                Network Topology
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 h-[250px] flex items-center justify-center">
              <NetworkTopology devices={devices} />
            </CardContent>
          </Card>
        </div>
        {/* RIGHT COLUMN → EVENTS */}
        <div className="flex flex-col">
          <Card className="overflow-hidden h-[300px]">
            <CardHeader className="px-4 py-3 border-b bg-muted/40">
              <CardTitle className="text-sm font-semibold">
                Live Network Events
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 overflow-y-auto h-[250px]">
              {events.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">
                  No network activity detected
                </div>
              )}

              <div className="divide-y">
                {events.map((e, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      {e.type === "join" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      )}

                      {e.type === "leave" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                      )}

                      <span className="text-sm font-medium">
                        {e.type === "join" ? "Device Joined" : "Device Left"}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {e.device.ip} • {e.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SUSPICIOUS DEVICES */}

      {alerts.length > 0 && (
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">
              🚨 Suspicious Devices ({alerts.length})
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {alerts.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border p-2 rounded bg-red-50 text-sm"
                >
                  <div>
                    <div className="font-semibold">{d.ip}</div>

                    <div className="text-xs text-muted-foreground">
                      Vendor: {d.vendor || "Unknown"} • OS: {d.os || "Unknown"}
                    </div>
                  </div>

                  <Badge variant="destructive">Alert</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* DEVICE TABLE */}

      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Detected Devices</span>
            <Badge variant="outline">{devices.length}</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="max-h-[420px] overflow-y-auto overflow-x-hidden border rounded-md">
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead>IP</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>MAC</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>OS</TableHead>
                  <TableHead>Ping</TableHead>
                  <TableHead>Ports</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {devices.length === 0 && !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No devices detected
                    </TableCell>
                  </TableRow>
                )}

                {devices.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell>{d.ip}</TableCell>

                    <TableCell>{d.hostname || "-"}</TableCell>

                    <TableCell>{d.mac || "-"}</TableCell>

                    <TableCell>{d.vendor || "-"}</TableCell>

                    <TableCell>
                      <Badge variant="secondary">{d.os || "Unknown"}</Badge>
                    </TableCell>

                    <TableCell>{d.latency || "-"}</TableCell>

                    <TableCell>
                      {d.ports?.length ? (
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {d.ports.map((p, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-[10px]"
                            >
                              {p.port}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
