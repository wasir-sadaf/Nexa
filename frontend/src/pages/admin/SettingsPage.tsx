import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="space-y-6 text-white">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-zinc-400 mt-1">Configure global application preferences.</p>
            </div>
            <Card className="max-w-2xl bg-zinc-950 border-zinc-800">
                <CardHeader>
                    <CardTitle>Platform Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Global Support Email</label>
                        <Input defaultValue="support@nexa.com" className="bg-zinc-900 border-zinc-800 text-white h-11" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Max Upload Size (MB)</label>
                        <Input defaultValue="25" type="number" className="bg-zinc-900 border-zinc-800 text-white h-11" />
                    </div>
                    <div className="pt-2">
                        <Button className="bg-white text-black hover:bg-zinc-200">Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}