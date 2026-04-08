import { Card, CardContent } from "@/components/ui/card";

export default function SummaryCards({ devices }: any) {

    const total = devices.length;

    const unknown = devices.filter(
        (d: any) => !d.vendor || d.vendor === "Unknown"
    ).length;

    const risk = devices.filter(
        (d: any) => d.ports?.includes(22)
    ).length;

    return (
        <div className="grid grid-cols-3 gap-4">

            <Card><CardContent>Total: {total}</CardContent></Card>
            <Card><CardContent>Unknown: {unknown}</CardContent></Card>
            <Card><CardContent>Risk: {risk}</CardContent></Card>

        </div>
    );
}