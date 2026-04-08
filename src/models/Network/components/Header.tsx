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

            <div className="flex gap-3 items-center">

                {/* LIVE STATUS */}
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    🔄 Live Monitoring
                </Badge>

                {/* DEEP SCAN BUTTON */}
                <Button
                    onClick={deepScan}
                    disabled={deepLoading}
                    className="flex items-center gap-2"
                >
                    {deepLoading ? (
                        <>
                            ⚡ Deep Scanning...
                        </>
                    ) : (
                        <>
                            ⚡ Run Deep Scan
                        </>
                    )}
                </Button>

            </div>

        </div>
    );
}