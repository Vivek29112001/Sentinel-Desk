"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/src/components/sidebar/Sidebar";
import MainMenu from "@/src/components/mainmenu/MainMenu";
import Header from "@/src/components/header/Header";

export default function Home() {
  const [page, setPage] = useState("os");
  const [metrics, setMetrics] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [osInfo, setOsInfo] = useState<any>({});

  const scan = async () => {
    try {
      if (!window?.electronAPI) {
        console.warn("Electron API not found");
        return;
      }

      const result = await window.electronAPI.scanSystem();

      if (!result) {
        console.warn("Scan returned null");
        return;
      }

      setMetrics(result);

      setHistory((prev) => [
        ...prev.slice(-30),

        {
          time: new Date().toLocaleTimeString(),
          cpu: result?.cpu ?? 0,
          memory: result?.memory ?? 0,
        },
      ]);
    } catch (err) {
      console.error("Scan failed", err);
    }
  };

  useEffect(() => {
    scan();

    const interval = setInterval(scan, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar setPage={setPage} />

      <div className="flex flex-col flex-1">
        <Header metrics={metrics} />

        <div className="flex-1 overflow-y-auto">
          <MainMenu
            page={page}
            metrics={metrics}
            history={history}
            osInfo={osInfo}
            setOsInfo={setOsInfo}
          />
        </div>
      </div>
    </div>
  );
}
