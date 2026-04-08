export const compareDevices = (live: any[], deep: any[]) => {

    const changes: any[] = [];
    const deepMap = new Map(deep.map(d => [d.ip, d]));

    live.forEach((l) => {
        const d = deepMap.get(l.ip);

        if (!d) {
            changes.push({ type: "NEW_DEVICE", ip: l.ip });
            return;
        }

        const livePorts = l.ports || [];
        const deepPorts = d.ports || [];

        const newPorts = livePorts.filter(p => !deepPorts.includes(p));

        if (newPorts.length) {
            changes.push({
                type: "NEW_PORT",
                ip: l.ip,
                ports: newPorts
            });
        }

        if (l.os && d.os && l.os !== d.os) {
            changes.push({
                type: "OS_CHANGED",
                ip: l.ip,
                from: d.os,
                to: l.os
            });
        }
    });

    return changes;
};