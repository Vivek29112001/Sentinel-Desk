"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, ShieldCheck, ShieldAlert, Database } from "lucide-react";

export default function AntivirusStatus() {
  const [antivirus, setAntivirus] = useState<any>(null);

  const loadStatus = async () => {
    if (!window?.electronAPI?.antivirusStatus) return;

    const data = await window.electronAPI.antivirusStatus();
    console.log(data);
    if (!data) return;

    setAntivirus(data);
  };

  useEffect(() => {
    loadStatus();

    const interval = setInterval(loadStatus, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!antivirus) return <div>Loading antivirus status...</div>;

  const enabled = antivirus?.antivirus_enabled;
  const realtime = antivirus?.real_time_protection;

  return (
    <div className="space-y-8">
      {/* PAGE TITLE */}

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Shield size={20} />
        Antivirus Security
      </h1>

      {/* STATUS CARDS */}

      <div className="grid md:grid-cols-3 gap-5">
        <StatCard
          title="Antivirus"
          value={enabled ? "Enabled" : "Disabled"}
          icon={enabled ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
        />

        <StatCard
          title="Real-time Protection"
          value={realtime ? "Active" : "Disabled"}
          icon={
            realtime ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />
          }
        />

        <StatCard
          title="Antivirus Name"
          value={antivirus?.name}
          icon={<Database size={18} />}
        />
      </div>

      {/* SECURITY DETAILS */}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Security Status</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <p>
              <b>Antivirus Enabled:</b>{" "}
              {enabled ? (
                <span className="text-green-600">Yes</span>
              ) : (
                <span className="text-red-500">No</span>
              )}
            </p>

            <p>
              <b>Real-time Protection:</b>{" "}
              {realtime ? (
                <span className="text-green-600">Enabled</span>
              ) : (
                <span className="text-red-500">Disabled</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Security Updates</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <p>
              <b>Last Scan:</b> {antivirus?.last_scan}
            </p>

            <p>
              <b>Definitions Updated:</b> {antivirus?.definitions_updated}
            </p>
          </CardContent>
        </Card>
      </div>
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
        <div className="text-xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
