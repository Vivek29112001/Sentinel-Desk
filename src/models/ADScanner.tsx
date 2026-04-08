"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Network } from "lucide-react";

export default function ADScanner() {
  const [data, setData] = useState<any>(null);

  const loadAD = async () => {
    if (!window?.electronAPI?.getADInfo) return;

    const result = await window.electronAPI.getADInfo();

    if (!result) return;

    setData(result);
  };

  useEffect(() => {
    loadAD();

    const interval = setInterval(loadAD, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Scanning Active Directory...</div>;

  const users = Array.isArray(data?.users)
    ? data.users
    : data?.users
      ? [data.users]
      : [];

  const groups = Array.isArray(data?.groups)
    ? data.groups
    : data?.groups
      ? [data.groups]
      : [];

  return (
    <div className="space-y-8">
      {/* PAGE TITLE */}

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Shield size={20} />
        Active Directory Scanner
      </h1>

      {/* DOMAIN INFO */}

      <Card className="bg-gray-50 border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle>Domain Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <p>
            <b>Domain Name:</b> {data?.domain_info?.domain}
          </p>

          <p>
            <b>Domain Controller:</b> {data?.domain_info?.controller}
          </p>

          <p>
            <b>Forest:</b> {data?.domain_info?.forest}
          </p>
        </CardContent>
      </Card>

      {/* AD USERS */}

      <Card className="bg-gray-50 border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={16} />
            AD Users
          </CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Enabled</th>
                <th className="p-2 text-left">Last Login</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u: any, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-100">
                  <td className="p-2 font-medium">{u.Name}</td>

                  <td className="p-2">
                    {u.Enabled ? (
                      <span className="text-green-600">Enabled</span>
                    ) : (
                      <span className="text-red-500">Disabled</span>
                    )}
                  </td>

                  <td className="p-2">{String(u.LastLogonDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* AD GROUPS */}

      <Card className="bg-gray-50 border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network size={16} />
            AD Groups
          </CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="p-2 text-left">Group Name</th>
              </tr>
            </thead>

            <tbody>
              {groups.map((g: any, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-100">
                  <td className="p-2 font-medium">{g.Name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
