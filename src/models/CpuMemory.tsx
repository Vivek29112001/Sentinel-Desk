"use client";

import SystemChart from "@/src/components/SystemChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, MemoryStick, Activity } from "lucide-react";

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
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Activity size={20} />
        CPU & Memory Monitor
      </h1>

      {/* Stats Cards */}

      <div className="grid md:grid-cols-3 gap-5">
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
          title="Running Processes"
          value={metrics?.processes?.length ?? 0}
          icon={<Activity size={18} />}
        />
      </div>

      {/* Charts */}

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">CPU Usage</CardTitle>
          </CardHeader>

          <CardContent>
            <SystemChart data={cpuData} color="#2563eb" />
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              Memory Usage
            </CardTitle>
          </CardHeader>

          <CardContent>
            <SystemChart data={memoryData} color="#16a34a" />
          </CardContent>
        </Card>
      </div>

      {/* Process Table */}

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
              </tr>
            </thead>

            <tbody>
              {metrics?.processes?.map((p: any) => (
                <tr
                  key={p.pid}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-2">{p.pid}</td>

                  <td className="p-2 font-medium">{p.name}</td>

                  <td className="p-2">{p.cpu_percent}</td>

                  <td className="p-2">{Number(p.memory_percent).toFixed(2)}</td>
                </tr>
              ))}
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
