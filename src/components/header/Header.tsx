"use client";

import { Card } from "@/components/ui/card";

export default function Header({ metrics }: any) {
  return (
    <div className="h-16 border-b flex items-center px-6 justify-between">
      <div className="flex gap-4 ">
        <Card className="px-4 py-2">CPU: {metrics?.cpu ?? 0}%</Card>

        <Card className="px-4 py-2">RAM: {metrics?.memory ?? 0}%</Card>

        <Card className="px-4 py-2">Disk: {metrics?.disk ?? 0}%</Card>
      </div>
    </div>
  );
}
