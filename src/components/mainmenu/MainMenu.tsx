"use client";

import ADScanner from "@/src/models/ADScanner";
import AntivirusStatus from "@/src/models/AntivirusStatus";
import CpuMemory from "@/src/models/CpuMemory";
import DiskUsage from "@/src/models/DiskUsage";
import NetworkMonitor from "@/src/models/NetworkMonitor";
import OSInfoComponent from "@/src/models/OSInfo";
import ThreatScanner from "@/src/models/ThreatScanner";

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

    ad: <ADScanner />,

    threat: <ThreatScanner />,
  };

  return (
    <div className="p-10">{pageComponents[page] || pageComponents.cpu}</div>
  );
}
