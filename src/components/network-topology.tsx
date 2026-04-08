// "use client";

// import ForceGraph2D from "react-force-graph-2d";

// export default function NetworkTopology({ devices }: any) {

//     const nodes = [
//         { id: "router", name: "Router", type: "router" },
//         { id: "internet", name: "Internet", type: "internet" },


//         ...devices.map((d: any) => ({
//             id: d.ip,
//             name: d.ip,
//             os: d.os,
//             type: d.device_type || "unknown",
//         })),


//     ];

//     const links = [
//         ...devices.map((d: any) => ({
//             source: d.ip,
//             target: "router",
//         })),
//         {
//             source: "router",
//             target: "internet",
//         },
//     ];

//     return (
//         <ForceGraph2D
//             graphData={{ nodes, links }}


//             nodeCanvasObject={(node: any, ctx, globalScale) => {
//                 const label = node.name;

//                 // COLOR LOGIC
//                 if (node.type === "router") ctx.fillStyle = "#2563eb";
//                 else if (node.type === "internet") ctx.fillStyle = "#9333ea";
//                 else if (node.type === "Mobile") ctx.fillStyle = "#16a34a";
//                 else if (node.type === "Laptop/PC") ctx.fillStyle = "#f59e0b";
//                 else ctx.fillStyle = "#ef4444";

//                 ctx.beginPath();
//                 ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
//                 ctx.fill();

//                 ctx.fillStyle = "#000";
//                 ctx.font = `${12 / globalScale}px Sans - Serif`;
//                 ctx.fillText(label, node.x + 8, node.y + 4);
//             }}

//             // 🔥 PACKET FLOW
//             linkDirectionalParticles={4}
//             linkDirectionalParticleSpeed={() => 0.01}
//             linkDirectionalParticleWidth={2}

//             nodeLabel={(node: any) =>
//                 `${node.name} (${node.type})`
//             }
//         />

//     );
// }


"use client";

import { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";
import { DataSet } from "vis-data";

export default function NetworkTopology({ devices }: any) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const safeDevices = devices?.filter((d: any) => d?.ip) || [];

        // =========================
        // NODES
        // =========================
        const nodes = new DataSet([
            {
                id: "router",
                label: "Router",
                color: "#2563eb",
                shape: "dot",
                size: 20,
            },
            {
                id: "internet",
                label: "Internet",
                color: "#9333ea",
                shape: "dot",
                size: 20,
            },

            ...safeDevices.map((d: any) => ({
                id: d.ip,
                label: `${d.ip}`,
                color:
                    d.device_type === "Mobile"
                        ? "#16a34a"
                        : d.device_type === "Laptop/PC"
                            ? "#f59e0b"
                            : "#ef4444",
                shape: "dot",
                size: 12,
                title: `
IP: ${d.ip}
OS: ${d.os || "Unknown"}
Type: ${d.device_type || "Unknown"}
        `,
            })),
        ]);

        // =========================
        // EDGES
        // =========================
        const edges = new DataSet([
            ...safeDevices.map((d: any) => ({
                from: d.ip,
                to: "router",
            })),
            {
                from: "router",
                to: "internet",
            },
        ]);

        // =========================
        // OPTIONS
        // =========================
        const options = {
            nodes: {
                font: {
                    size: 12,
                    color: "#000",
                },
            },
            edges: {
                color: "#ccc",
                arrows: {
                    to: false,
                },
                smooth: true,
            },
            physics: {
                enabled: true,
                barnesHut: {
                    gravitationalConstant: -3000,
                    centralGravity: 0.3,
                    springLength: 150,
                    springConstant: 0.04,
                },
                stabilization: {
                    iterations: 150
                }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200,
            },
        };

        // =========================
        // CREATE NETWORK
        // =========================
        const network = new Network(
            containerRef.current,
            { nodes, edges },
            options
        );

        return () => {
            network.destroy();
        };
    }, [devices]);

    return <div ref={containerRef} className="w-full h-full" />;
}