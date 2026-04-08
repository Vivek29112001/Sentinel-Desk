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
import { Wifi } from "lucide-react";

import NetworkTopology from "../components/network-topology";

type Device = {
  ip: string;
  hostname?: string;
  mac?: string;
  os?: string;
  vendor?: string;
  device_type?: string;
  ports?: number[];
};

type Event = {
  type: "join" | "leave";
  device: Device;
  time: string;
};

export default function NetworkScanner() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [previousDevices, setPreviousDevices] = useState<Device[]>([]);
  const [loadingIP, setLoadingIP] = useState<string | null>(null);

  // =====================
  // 🔥 MERGE FIX (IMPORTANT)
  // =====================

  const mergeDevices = (oldList: Device[], newList: Device[]) => {
    return newList.map((newD) => {
      const old = oldList.find((o) => o.ip === newD.ip);
      return {
        ...old,
        ...newD,
      };
    });
  };

  // =====================
  // LIVE SCAN
  // =====================

  const liveScan = async () => {
    try {
      if (!window?.electronAPI) return;

      const result = await window.electronAPI.liveScan();
      if (!result) return;

      const deviceData: Device[] = result;

      // 🔥 FIX: merge instead of replace
      setDevices((prev) => mergeDevices(prev, deviceData));

      const joined = deviceData.filter(
        (n) => !previousDevices.some((o) => o.ip === n.ip)
      );

      const left = previousDevices.filter(
        (o) => !deviceData.some((n) => n.ip === o.ip)
      );

      const newEvents: Event[] = [];

      joined.forEach((d) =>
        newEvents.push({
          type: "join",
          device: d,
          time: new Date().toLocaleTimeString(),
        })
      );

      left.forEach((d) =>
        newEvents.push({
          type: "leave",
          device: d,
          time: new Date().toLocaleTimeString(),
        })
      );

      if (newEvents.length) {
        setEvents((prev) => [...newEvents, ...prev].slice(0, 20));
      }

      setPreviousDevices(deviceData);
    } catch (err) {
      console.error("Live scan error:", err);
    }


  };

  // =====================
  // PORT SCAN
  // =====================

  const scanPorts = async (ip: string) => {
    try {
      if (!window?.electronAPI) return;


      setLoadingIP(ip);

      const res = await window.electronAPI.portScan(ip);
      if (!res) return;

      setDevices((prev) =>
        prev.map((d) =>
          d.ip === ip
            ? {
              ...d,
              ports: res.ports || [],
              os: res.os || d.os,
              device_type: res.device_type || d.device_type,
              vendor: res.vendor || d.vendor,
            }
            : d
        )
      );
    } catch (err) {
      console.error("Port scan error:", err);
    } finally {
      setLoadingIP(null);
    }

  };

  useEffect(() => {
    liveScan();


    const interval = setInterval(() => {
      liveScan();
    }, 15000);

    return () => clearInterval(interval);


  }, []);

  // =====================
  // CALCULATIONS
  // =====================

  const totalDevices = devices.length;

  const unknownDevices = devices.filter(
    (d) =>
      !d.vendor ||
      d.vendor === "Unknown" ||
      !d.device_type ||
      d.device_type === "Unknown"
  ).length;

  const riskyDevices = devices.filter((d) =>
    d.ports?.some((p) => p === 22 || p === 3389)
  ).length;

  // =====================
  // RISK FUNCTION
  // =====================

  const getRisk = (d: Device) => {
    if (
      !d.vendor ||
      d.vendor === "Unknown" ||
      !d.device_type ||
      d.device_type === "Unknown"
    )
      return "high";


    if (d.ports?.includes(22) || d.ports?.includes(3389))
      return "medium";

    return "safe";


  };

  return (<div className="space-y-6 p-6 w-full overflow-x-hidden">


    {/* HEADER */}
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <Wifi size={20} />
        Network Scanner
      </h1>
    </div>

    {/* SUMMARY */}
    <div className="grid grid-cols-3 gap-4">

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Total Devices</p>
          <h2 className="text-xl font-bold">{totalDevices}</h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Unknown Devices</p>
          <h2 className="text-xl font-bold text-red-500">
            {unknownDevices}
          </h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Risk Devices</p>
          <h2 className="text-xl font-bold text-yellow-500">
            {riskyDevices}
          </h2>
        </CardContent>
      </Card>

    </div>

    {/* TOPOLOGY + EVENTS (UNCHANGED UI) */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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

      <Card className="overflow-hidden h-[300px]">
        <CardHeader className="px-4 py-3 border-b bg-muted/40">
          <CardTitle className="text-sm font-semibold">
            Live Network Events
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto h-[250px]">
          {events.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">
              No activity
            </div>
          )}

          <div className="divide-y">
            {events.map((e, i) => (
              <div key={i} className="flex justify-between px-4 py-2 text-sm">
                <span>
                  {e.type === "join" ? "🟢 Joined" : "🟠 Left"}
                </span>
                <span>
                  {e.device.ip} • {e.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>

    {/* DEVICE TABLE */}
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
              <TableHead>Host</TableHead>
              <TableHead>MAC</TableHead>
              <TableHead>OS</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ports</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {devices.map((d, i) => {

              const isUnknown =
                !d.vendor ||
                d.vendor === "Unknown" ||
                !d.device_type ||
                d.device_type === "Unknown";

              return (
                <TableRow key={i}>

                  <TableCell>{d.ip}</TableCell>
                  <TableCell>{d.hostname || "-"}</TableCell>
                  <TableCell>{d.mac || "-"}</TableCell>

                  <TableCell>
                    <Badge variant="secondary">
                      {d.os || "Unknown"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={isUnknown ? "destructive" : "secondary"}>
                      {d.vendor || "Unknown"}
                    </Badge>
                  </TableCell>

                  <TableCell>{d.device_type || "-"}</TableCell>

                  <TableCell>
                    {d.ports?.length ? d.ports.join(", ") : "-"}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => scanPorts(d.ip)}
                      disabled={loadingIP === d.ip}
                    >
                      {loadingIP === d.ip ? "Scanning..." : "Scan Ports"}
                    </Button>
                  </TableCell>

                </TableRow>
              );
            })}

          </TableBody>
        </Table>

      </CardContent>
    </Card>

  </div>


  );
}
