"use client";

import { useEffect, useState } from "react";
import SystemChart from "@/src/components/SystemChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi } from "lucide-react";

export default function NetworkMonitor() {
  const [network, setNetwork] = useState<any>(null);

  const loadNetwork = async () => {
    if (!window?.electronAPI?.networkMonitor) return;

    const data = await window.electronAPI.networkMonitor();

    console.log("Network data:", data);

    if (!data) return;

    setNetwork(data);
  };

  useEffect(() => {
    loadNetwork();

    const interval = setInterval(loadNetwork, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!network) return <div>Loading network data...</div>;

  const speedGraph = [
    { time: "Upload", value: network.upload_mb },
    { time: "Download", value: network.download_mb },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Wifi size={20} />
        Network Monitor
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Network Speed</CardTitle>
          </CardHeader>

          <CardContent className="h-[250px]">
            <SystemChart data={speedGraph} />
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Network Info</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <b>IP Address:</b> {network.ip_address}
              </p>

              <p>
                <b>Upload:</b> {network.upload_mb} MB
              </p>

              <p>
                <b>Download:</b> {network.download_mb} MB
              </p>

              <p>
                <b>Active Connections:</b> {network.connections}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-2">{i.interface}</td>

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
