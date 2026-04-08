"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function ThreatScanner() {
  const [data, setData] = useState<any>(null);

  const loadThreats = async () => {
    if (!window?.electronAPI?.threatScan) return;

    const result = await window.electronAPI.threatScan();

    if (!result) return;

    setData(result);
  };

  useEffect(() => {
    loadThreats();

    const interval = setInterval(loadThreats, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Scanning threats...</div>;

  const threats = data?.threats || [];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ShieldAlert size={20} />
        Threat Detection
      </h1>

      {/* STATS */}

      <Card className="bg-red-50 border border-red-200 rounded-xl">
        <CardHeader>
          <CardTitle>Total Threats Detected</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold text-red-600">
            {threats.length}
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}

      <Card className="bg-gray-50 border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle>Suspicious Processes</CardTitle>
        </CardHeader>

        <CardContent>
          {threats.length === 0 && (
            <div className="text-green-600 font-medium">
              System Secure — No threats detected
            </div>
          )}

          {threats.length > 0 && (
            <table className="w-full text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="p-2 text-left">PID</th>
                  <th className="p-2 text-left">Process</th>
                  <th className="p-2 text-left">Reason</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {threats.map((t: any, i: number) => (
                  <tr key={i} className="border-b hover:bg-red-50">
                    <td className="p-2">{t.pid}</td>

                    <td className="p-2 font-medium">{t.name}</td>

                    <td className="p-2 text-red-500">{t.reason}</td>

                    <td className="p-2">
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        onClick={() => window.electronAPI.killProcess(t.pid)}
                      >
                        Kill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
