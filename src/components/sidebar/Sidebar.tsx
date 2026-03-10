"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Sidebar({ setPage }: any) {
  const items = [
    { id: "os", label: "OS Info" },
    { id: "cpu", label: "CPU & Memory" },
    { id: "disk", label: "Disk Usage" },
    { id: "network", label: "Network" },
    { id: "antivirus", label: "Antivirus" },
    { id: "ad", label: "AD Scanner" },
    { id: "threat", label: "Threat Scanner" },
  ];

  return (
    <div className="w-64 h-screen border-r bg-background flex flex-col">
      {/* TOP LOGO AREA (same as header height) */}

      <div className="h-16 px-4 flex items-center gap-3">
        <Avatar>
          <AvatarFallback>TS</AvatarFallback>
        </Avatar>

        <div>
          <p className="font-bold">Turbo Scanner</p>
          <p className="text-xs text-muted-foreground">System Monitor</p>
        </div>
      </div>

      <Separator />

      {/* MENU */}

      <div className="p-4 flex flex-col gap-2">
        {items.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="justify-start"
            onClick={() => setPage(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
