"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@base-ui/react";
import { Shield } from "lucide-react";

export default function Header({
  metrics,
  setMetrics,
  setScanning,
  setProgress,
}: any) {
  const runFullScan = async () => {
    try {
      if (!window?.electronAPI) return;

      setScanning(true);
      setProgress(10);

      await new Promise((r) => setTimeout(r, 400));
      setProgress(40);

      await new Promise((r) => setTimeout(r, 400));
      setProgress(70);

      const result = await window.electronAPI.scanSystem();

      if (result) setMetrics(result);

      setProgress(100);
    } catch (err) {
      console.error("Scan failed", err);
    } finally {
      setTimeout(() => {
        setScanning(false);
        setProgress(0);
      }, 800);
    }
  };

  return (
    <div className="h-16 border-b flex items-center px-6 justify-between">
      <Button
        onClick={runFullScan}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg bg-white hover:bg-gray-100 transition"
      >
        <Shield size={16} />
        Run Full Scan
      </Button>

      <div className="flex gap-4">
        <Card className="px-4 py-2 text-sm font-medium">
          CPU: {metrics?.cpu ?? 0}%
        </Card>

        <Card className="px-4 py-2 text-sm font-medium">
          RAM: {metrics?.memory ?? 0}%
        </Card>

        <Card className="px-4 py-2 text-sm font-medium">
          Disk: {metrics?.disk ?? 0}%
        </Card>
      </div>
    </div>
  );
}
