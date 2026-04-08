"use client";

import { useEffect, useState } from "react";
import SystemChart from "@/src/components/SystemChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Upload, Download, Activity } from "lucide-react";

export default function NetworkMonitor() {
  const [network, setNetwork] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const loadNetwork = async () => {
    if (!window?.electronAPI?.networkMonitor) return;

    const data = await window.electronAPI.networkMonitor();

    if (!data) return;

    setNetwork(data);

    setHistory((prev) => [
      ...prev.slice(-20),
      {
        time: new Date().toLocaleTimeString(),
        upload: data.upload_kb,
        download: data.download_kb,
      },
    ]);
  };

  useEffect(() => {
    loadNetwork();

    const interval = setInterval(loadNetwork, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!network) return <div>Loading network...</div>;

  const uploadGraph = history.map((h) => ({
    time: h.time,
    value: h.upload,
  }));

  const downloadGraph = history.map((h) => ({
    time: h.time,
    value: h.download,
  }));

  return (
    <div className="space-y-8">
      {/* PAGE TITLE */}

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Wifi size={20} />
        Network Monitor
      </h1>

      {/* TOP METRIC CARDS */}

      <div className="grid md:grid-cols-4 gap-5">
        <StatCard
          title="Upload Speed"
          value={`${network.upload_kb} KB/s`}
          icon={<Upload size={18} />}
        />

        <StatCard
          title="Download Speed"
          value={`${network.download_kb} KB/s`}
          icon={<Download size={18} />}
        />

        <StatCard
          title="Connections"
          value={network.connections}
          icon={<Activity size={18} />}
        />

        <StatCard
          title="IP Address"
          value={network.ip_address}
          icon={<Wifi size={18} />}
        />
      </div>

      {/* GRAPHS */}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Upload Speed</CardTitle>
          </CardHeader>

          <CardContent className="h-[250px]">
            <SystemChart data={uploadGraph} />
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Download Speed</CardTitle>
          </CardHeader>

          <CardContent className="h-[250px]">
            <SystemChart data={downloadGraph} />
          </CardContent>
        </Card>
      </div>

      {/* NETWORK INTERFACES */}

      <Card className="bg-gray-50 border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle>Network Interfaces</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="text-left p-2">Interface</th>
                <th className="text-left p-2">IP Address</th>
              </tr>
            </thead>

            <tbody>
              {network.interfaces.map((i: any, index: number) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-2 font-medium">{i.interface}</td>

                  <td className="p-2">{i.ip}</td>
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
    <Card className="bg-gray-50 border border-gray-200 hover:shadow-md transition rounded-xl">
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
