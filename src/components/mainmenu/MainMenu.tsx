"use client";

import AntivirusStatus from "@/src/models/AntivirusStatus";
import CpuMemory from "@/src/models/CpuMemory";
import DiskUsage from "@/src/models/DiskUsage";
import NetworkMonitor from "@/src/models/NetworkMonitor";
import OSInfoComponent from "@/src/models/OSInfo";

export default function MainMenu({
  page,
  metrics,
  history,
  osInfo,
  setOsInfo,
}: any) {
  const pageComponents: any = {
    os: <OSInfoComponent osInfo={osInfo} setOsInfo={setOsInfo} />,

    cpu: <CpuMemory metrics={metrics} history={history} />,

    disk: <DiskUsage />,

    network: <NetworkMonitor />,

    antivirus: <AntivirusStatus />,

    ad: <h2 className="text-2xl font-bold">AD Scanner</h2>,
  };

  return (
    <div className="p-10">{pageComponents[page] || pageComponents.cpu}</div>
  );
}
