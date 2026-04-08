"use client";

import SystemChart from "@/src/components/SystemChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, MemoryStick, Activity, Server } from "lucide-react";

export default function CpuMemory({ metrics, history }: any) {
  if (!metrics) return <div className="text-lg">Loading CPU data...</div>;

  const cpuData = history.map((h: any) => ({
    time: h.time,
    value: h.cpu ?? 0,
  }));

  const memoryData = history.map((h: any) => ({
    time: h.time,
    value: h.memory ?? 0,
  }));

  return (
    <div className="space-y-8">
      {/* PAGE TITLE */}

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Activity size={20} />
        CPU & Memory Monitor
      </h1>

      {/* TOP STATS */}

      <div className="grid md:grid-cols-4 gap-5">
        <StatCard
          title="CPU Usage"
          value={`${metrics?.cpu ?? 0}%`}
          icon={<Cpu size={18} />}
        />

        <StatCard
          title="Memory Usage"
          value={`${metrics?.memory ?? 0}%`}
          icon={<MemoryStick size={18} />}
        />

        <StatCard
          title="Total RAM"
          value={`${metrics?.total_ram_gb ?? "-"} GB`}
          icon={<Server size={18} />}
        />

        <StatCard
          title="Running Processes"
          value={metrics?.processes?.length ?? 0}
          icon={<Activity size={18} />}
        />
      </div>

      {/* CHARTS */}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>CPU Usage</CardTitle>
          </CardHeader>

          <CardContent>
            <SystemChart data={cpuData} color="#2563eb" />
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
          </CardHeader>

          <CardContent>
            <SystemChart data={memoryData} color="#16a34a" />
          </CardContent>
        </Card>
      </div>

      {/* TOP PROCESSES */}

      <Card className="bg-gray-50 border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle>Top Processes</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="text-left p-2">PID</th>
                <th className="text-left p-2">Process</th>
                <th className="text-left p-2">CPU %</th>
                <th className="text-left p-2">Memory %</th>
                <th className="text-left p-2">RAM MB</th>
                <th className="text-left p-2">User</th>
              </tr>
            </thead>

            <tbody>
              {metrics?.processes?.map((p: any) => {
                const cpu = Number(p.cpu_percent ?? 0);
                const mem = Number(p.memory_percent ?? 0);

                return (
                  <tr
                    key={p.pid}
                    className={`border-b hover:bg-gray-100 transition
                  ${cpu > 50 ? "bg-red-50" : ""}`}
                  >
                    <td className="p-2 text-gray-600">{p.pid}</td>

                    <td className="p-2 font-medium">
                      {p.name || "Unknown Process"}
                    </td>

                    <td
                      className={`p-2 font-medium
                  ${cpu > 50 ? "text-red-600" : ""}`}
                    >
                      {cpu.toFixed(1)} %
                    </td>

                    <td className="p-2">{mem.toFixed(2)} %</td>

                    <td className="p-2">
                      {p.memory_mb ? `${p.memory_mb} MB` : "-"}
                    </td>

                    <td className="p-2 text-gray-600">{p.user || "SYSTEM"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <Card className="bg-gray-50 border border-gray-200 hover:shadow-md transition rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-gray-500">{title}</CardTitle>

        {icon}
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
