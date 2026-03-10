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

  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const scan = async () => {
    try {
      if (!window?.electronAPI) return;

      const result = await window.electronAPI.scanSystem();

      if (!result) return;

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
        <Header
          metrics={metrics}
          setMetrics={setMetrics}
          setScanning={setScanning}
          setProgress={setProgress}
        />

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

      {/* FULL SCREEN SCAN OVERLAY */}

      {scanning && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-96 text-center space-y-5">
            <h2 className="text-xl font-bold">Scanning System</h2>

            <p className="text-sm text-gray-500">
              Checking processes, antivirus and system health...
            </p>

            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="bg-blue-600 h-3 rounded transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm font-medium">{progress}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
