import NetworkTopology from "@/src/components/network-topology";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TopologySection({ devices }: any) {
    return (
        <Card className="h-[300px]">
            <CardHeader>
                <CardTitle>Network Topology</CardTitle>
            </CardHeader>

            <CardContent className="h-[250px]">
                <NetworkTopology devices={devices} />
            </CardContent>
        </Card>
    );
}