"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AntivirusStatus() {
  const [antivirus, setAntivirus] = useState<any>(null);

  const loadStatus = async () => {
    if (!window?.electronAPI?.antivirusStatus) return;

    const data = await window.electronAPI.antivirusStatus();

    console.log("Antivirus:", data);

    if (!data) return;

    setAntivirus(data);
  };

  useEffect(() => {
    loadStatus();

    const interval = setInterval(loadStatus, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!antivirus) return <div>Loading antivirus status...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Shield size={20} />
        Antivirus Status
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Antivirus</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <p>
              <b>Name:</b> {antivirus.name}
            </p>

            <p>
              <b>Enabled:</b> {antivirus.antivirus_enabled ? "Yes" : "No"}
            </p>

            <p>
              <b>Real-time Protection:</b>{" "}
              {antivirus.real_time_protection ? "Enabled" : "Disabled"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Security Updates</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <p>
              <b>Last Scan:</b> {antivirus.last_scan}
            </p>

            <p>
              <b>Definitions Updated:</b> {antivirus.definitions_updated}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
