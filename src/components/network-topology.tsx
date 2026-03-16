"use client";

import dynamic from "next/dynamic";
import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

type Device = {
  ip: string;
  hostname?: string;
};

export default function NetworkTopology({ devices }: { devices: Device[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState({
    width: 400,
    height: 220,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const resize = () => {
      setSize({
        width: containerRef.current!.offsetWidth,
        height: 220,
      });
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const nodes = [
    { id: "router", name: "Router", type: "router" },
    ...devices.map((d) => ({
      id: d.ip,
      name: d.hostname || d.ip,
      type: "device",
    })),
  ];

  const links = devices.map((d) => ({
    source: "router",
    target: d.ip,
  }));

  return (
    <Card>
      <CardContent ref={containerRef}>
        <ForceGraph2D
          width={size.width}
          height={size.height}
          graphData={{ nodes, links }}
          nodeLabel={(node: any) => node.name}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name;

            const fontSize = 12 / globalScale;

            ctx.font = `${fontSize}px Sans-Serif`;

            ctx.beginPath();

            ctx.arc(
              node.x,
              node.y,
              node.type === "router" ? 8 : 5,
              0,
              2 * Math.PI,
            );

            ctx.fillStyle = node.type === "router" ? "#2563eb" : "#10b981";

            ctx.fill();

            ctx.fillStyle = "#111";

            ctx.fillText(label, node.x + 8, node.y + 3);
          }}
          linkColor={() => "#94a3b8"}
          linkWidth={1.5}
          cooldownTicks={100}
        />
      </CardContent>
    </Card>
  );
}
