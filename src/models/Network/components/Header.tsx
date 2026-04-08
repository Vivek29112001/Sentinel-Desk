import { Button } from "@/components/ui/button";
import { Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Header({ deepScan, deepLoading }: any) {
    return (
        <div className="flex items-center justify-between">

            <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Wifi size={20} />
                Network Scanner
            </h1>

            <div className="flex gap-2">

                <Badge variant="secondary">
                    🔄 Live Scan Running
                </Badge>

                <Button onClick={deepScan} disabled={deepLoading}>
                    {deepLoading ? "Scanning..." : "⚡ Deep Scan"}
                </Button>

            </div>

        </div>
    );
}