"use client";

import { useEffect, useState } from "react";
import SystemChart from "@/src/components/SystemChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, Activity, Database } from "lucide-react";

export default function DiskUsage() {
  const [disk, setDisk] = useState<any>(null);

  const loadDisk = async () => {
    if (!window?.electronAPI?.getDiskUsage) return;

    const data = await window.electronAPI.getDiskUsage();

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

  const totalDisk = disk?.disks?.reduce(
    (acc: number, d: any) => acc + d.total_gb,
    0,
  );
  const usedDisk = disk?.disks?.reduce(
    (acc: number, d: any) => acc + d.used_gb,
    0,
  );

  return (
    <div className="space-y-8">
      {/* PAGE TITLE */}

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <HardDrive size={20} />
        Disk Monitoring
      </h1>

      {/* TOP STATS */}

      <div className="grid md:grid-cols-3 gap-5">
        <StatCard
          title="Total Disk"
          value={`${totalDisk} GB`}
          icon={<Database size={18} />}
        />

        <StatCard
          title="Used Disk"
          value={`${usedDisk} GB`}
          icon={<HardDrive size={18} />}
        />

        <StatCard
          title="Disk Activity"
          value={`${disk?.disk_io?.read_mb ?? 0} MB Read`}
          icon={<Activity size={18} />}
        />
      </div>

      {/* CHARTS */}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Drive Usage</CardTitle>
          </CardHeader>

          <CardContent className="h-[250px]">
            <SystemChart data={usageGraph} />
          </CardContent>
        </Card>

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
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Used</th>
                <th className="p-2 text-left">Free</th>
                <th className="p-2 text-left">Usage</th>
              </tr>
            </thead>

            <tbody>
              {disk?.disks?.map((d: any, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-100">
                  <td className="p-2 font-medium">{d.device}</td>

                  <td className="p-2">{d.total_gb} GB</td>

                  <td className="p-2">{d.used_gb} GB</td>

                  <td className="p-2">{d.free_gb} GB</td>

                  <td className="p-2 w-[200px]">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 h-2 rounded">
                        <div
                          className="bg-blue-500 h-2 rounded"
                          style={{ width: `${d.percent}%` }}
                        />
                      </div>

                      <span className="text-xs">{d.percent}%</span>
                    </div>
                  </td>
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
                <th className="p-2 text-left">Read</th>
                <th className="p-2 text-left">Write</th>
              </tr>
            </thead>

            <tbody>
              {disk?.top_processes?.map((p: any) => (
                <tr key={p.pid} className="border-b hover:bg-gray-100">
                  <td className="p-2">{p.pid}</td>

                  <td className="p-2 font-medium">{p.name}</td>

                  <td className="p-2">{p.read_mb} MB</td>

                  <td className="p-2">{p.write_mb} MB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <Card className="bg-gray-50 border border-gray-200 rounded-xl hover:shadow-md transition">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-gray-500">{title}</CardTitle>

        {icon}
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
