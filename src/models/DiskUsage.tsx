"use client";

import { useEffect, useState } from "react";
import SystemChart from "@/src/components/SystemChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, Activity } from "lucide-react";

export default function DiskUsage() {
  const [disk, setDisk] = useState<any>(null);

  const loadDisk = async () => {
    if (!window?.electronAPI?.getDiskUsage) return;

    const data = await window.electronAPI.getDiskUsage();

    console.log("Disk API result:", data);

    if (!data) return;

    setDisk(data);
  };

  useEffect(() => {
    loadDisk();

    const interval = setInterval(loadDisk, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!disk) return <div>Loading disk info...</div>;

  const usageGraph =
    disk?.disks?.map((d: any) => ({
      time: d.device,
      value: d.percent,
    })) || [];

  const ioGraph = [
    { time: "Read", value: disk?.disk_io?.read_mb ?? 0 },
    { time: "Write", value: disk?.disk_io?.write_mb ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <HardDrive size={20} />
        Disk Monitoring
      </h1>

      {/* GRAPH SECTION */}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Drive Usage Graph */}

        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Drive Usage</CardTitle>
          </CardHeader>

          <CardContent className="h-[250px]">
            <SystemChart data={usageGraph} />
          </CardContent>
        </Card>

        {/* Disk IO Monitor */}

        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={16} />
              Disk IO Monitor
            </CardTitle>
          </CardHeader>

          <CardContent className="h-[250px]">
            <SystemChart data={ioGraph} />
          </CardContent>
        </Card>
      </div>

      {/* DISK PARTITIONS */}

      <Card className="bg-gray-50 border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle>Disk Partitions</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="p-2 text-left">Drive</th>
                <th className="p-2 text-left">Total (GB)</th>
                <th className="p-2 text-left">Used (GB)</th>
                <th className="p-2 text-left">Free (GB)</th>
                <th className="p-2 text-left">Usage %</th>
              </tr>
            </thead>

            <tbody>
              {disk?.disks?.map((d: any, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-100">
                  <td className="p-2 font-medium">{d.device}</td>

                  <td className="p-2">{d.total_gb}</td>

                  <td className="p-2">{d.used_gb}</td>

                  <td className="p-2">{d.free_gb}</td>

                  <td className="p-2">{d.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* TOP DISK PROCESSES */}

      <Card className="bg-gray-50 border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle>Top Disk Processes</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="p-2 text-left">PID</th>
                <th className="p-2 text-left">Process</th>
                <th className="p-2 text-left">Read MB</th>
                <th className="p-2 text-left">Write MB</th>
              </tr>
            </thead>

            <tbody>
              {disk?.top_processes?.map((p: any) => (
                <tr key={p.pid} className="border-b hover:bg-gray-100">
                  <td className="p-2">{p.pid}</td>

                  <td className="p-2 font-medium">{p.name}</td>

                  <td className="p-2">{p.read_mb}</td>

                  <td className="p-2">{p.write_mb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
