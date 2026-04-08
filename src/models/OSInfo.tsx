"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, HardDrive, Network, Monitor } from "lucide-react";

export default function OSInfo({ osInfo, setOsInfo }: any) {
  const loadStatic = async () => {
    try {
      if (osInfo?.static) return;
      if (!window?.electronAPI?.getOSStatic) return;

      const data = await window.electronAPI.getOSStatic();

      if (!data) return;

      setOsInfo((prev: any) => ({
        ...(prev || {}),
        static: data,
      }));
    } catch (err) {
      console.error("Static OS info error:", err);
    }
  };

  const loadDynamic = async () => {
    try {
      if (!window?.electronAPI?.getOSDynamic) return;

      const data = await window.electronAPI.getOSDynamic();

      if (!data) return;

      setOsInfo((prev: any) => ({
        ...(prev || {}),
        dynamic: data,
      }));
    } catch (err) {
      console.error("Dynamic OS info error:", err);
    }
  };

  useEffect(() => {
    loadStatic();
    loadDynamic();

    const interval = setInterval(loadDynamic, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!osInfo?.static)
    return <div className="text-lg">Loading system info...</div>;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold flex items-center gap-2">
        Operating System Information
      </h1>

      {/* System Info */}
      <Section title="System Information" icon={<Monitor size={18} />}>
        <InfoCard title="OS Name" value={osInfo?.static?.os_name} />
        <InfoCard title="OS Version" value={osInfo?.static?.os_version} />
        <InfoCard title="Hostname" value={osInfo?.static?.hostname} />
        <InfoCard title="Username" value={osInfo?.static?.username} />
        <InfoCard title="Architecture" value={osInfo?.static?.architecture} />
      </Section>

      {/* Hardware Info */}
      <Section title="Hardware Information" icon={<Cpu size={18} />}>
        <InfoCard title="CPU Model" value={osInfo?.static?.cpu_model} />
        <InfoCard title="CPU Cores" value={osInfo?.static?.cpu_cores} />
        <InfoCard title="Total RAM (GB)" value={osInfo?.static?.ram_total_gb} />
      </Section>

      {/* Network Info */}
      <Section title="Network Information" icon={<Network size={18} />}>
        <InfoCard title="MAC Address" value={osInfo?.static?.mac_address} />
        <InfoCard title="IP Address" value={osInfo?.dynamic?.ip_address} />
        <InfoCard title="Boot Time" value={osInfo?.dynamic?.boot_time} />
      </Section>
    </div>
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        {icon}
        {title}
      </h2>

      <div className="grid md:grid-cols-3 gap-5">{children}</div>
    </div>
  );
}

function InfoCard({ title, value }: any) {
  return (
    <Card className="bg-gray-50 border border-gray-200 hover:shadow-md transition-all rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-500 font-medium">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-lg font-semibold text-gray-800">
          {value ?? "N/A"}
        </div>
      </CardContent>
    </Card>
  );
}
