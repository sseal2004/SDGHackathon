
"use client";

import { useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ArrowRightLeft, 
  Warehouse, 
  TrendingUp, 
  Zap, 
  History, 
  AlertCircle,
  BarChart2
} from "lucide-react";
import { autonomousInventoryRebalancing, type AutonomousInventoryRebalancingOutput } from "@/ai/flows/autonomous-inventory-rebalancing-flow";
import { toast } from "@/hooks/use-toast";

export default function InventoryPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [plan, setPlan] = useState<AutonomousInventoryRebalancingOutput | null>(null);

  const generateRebalancingPlan = async () => {
    setIsProcessing(true);
    try {
      const result = await autonomousInventoryRebalancing({
        currentInventory: [
          { warehouseId: "WH-CHI", sku: "SKU-PRO-MAX", quantity: 1200 },
          { warehouseId: "WH-LB", sku: "SKU-PRO-MAX", quantity: 200 },
        ],
        predictedDemand: [
          { sku: "SKU-PRO-MAX", location: "WH-LB", period: "next_week", demandQuantity: 800 },
        ],
        potentialDelays: [
          { sku: "SKU-PRO-MAX", originWarehouseId: "WH-CHI", delayDays: 2, impactProbability: 0.3 },
        ],
        warehouseDetails: [
          { warehouseId: "WH-CHI", location: "Chicago, IL", capacity: 5000, availableCapacity: 3800 },
          { warehouseId: "WH-LB", location: "Long Beach, CA", capacity: 2000, availableCapacity: 1800 },
        ],
      });
      setPlan(result);
      toast({
        title: "Rebalancing Plan Generated",
        description: "AI has calculated optimal stock movements.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not create rebalancing plan.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger />
          <h1 className="text-lg font-headline font-bold">Autonomous Inventory Rebalancing</h1>
        </header>

        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-headline">Self-Healing Inventory</h2>
              <p className="text-sm text-muted-foreground">Proactive reallocation to prevent stockouts across 12 nodes</p>
            </div>
            <Button onClick={generateRebalancingPlan} disabled={isProcessing} className="gap-2 h-12 px-6">
              {isProcessing ? <History className="animate-spin" /> : <Zap className="fill-current" />}
              {isProcessing ? "Processing Live Data..." : "Run Rebalancing AI"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-1 border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-primary" />
                  Warehouse Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "WH-CHI", loc: "Chicago", util: 24, status: "Normal" },
                  { id: "WH-LB", loc: "Long Beach", util: 92, status: "Alert" },
                  { id: "WH-ATL", loc: "Atlanta", util: 56, status: "Normal" },
                ].map((wh) => (
                  <div key={wh.id} className="p-3 rounded-lg border bg-muted/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold">{wh.id}</span>
                      <Badge variant={wh.status === "Alert" ? "destructive" : "outline"} className="text-[9px]">
                        {wh.status}
                      </Badge>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${wh.util > 90 ? "bg-red-500" : "bg-primary"}`} 
                        style={{ width: `${wh.util}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>{wh.loc}</span>
                      <span>{wh.util}% full</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-none shadow-sm bg-white overflow-hidden">
               {!plan && !isProcessing && (
                 <div className="flex flex-col items-center justify-center h-[400px] text-center p-8 bg-slate-50/50">
                   <Package className="w-16 h-16 text-muted-foreground/20 mb-4" />
                   <h3 className="text-lg font-bold">No Active Rebalancing Plan</h3>
                   <p className="text-sm text-muted-foreground max-w-sm">
                     Click 'Run Rebalancing AI' to analyze network-wide demand spikes and potential logistics delays.
                   </p>
                 </div>
               )}

               {plan && (
                 <div className="animate-in fade-in duration-500">
                    <CardHeader className="bg-primary/5 border-b">
                      <div className="flex justify-between items-center">
                        <CardTitle>AI Rebalancing Strategy</CardTitle>
                        <Badge className="bg-primary">{plan.rebalancingPlan.length} Transfers Required</Badge>
                      </div>
                      <CardDescription className="max-w-2xl">{plan.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-bold border-b">
                            <tr>
                              <th className="px-6 py-4">SKU Identifier</th>
                              <th className="px-6 py-4">From Node</th>
                              <th className="px-6 py-4">To Node</th>
                              <th className="px-6 py-4">Quantity</th>
                              <th className="px-6 py-4">Reasoning</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {plan.rebalancingPlan.map((move, i) => (
                              <tr key={i} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-primary">{move.sku}</td>
                                <td className="px-6 py-4">{move.fromWarehouseId}</td>
                                <td className="px-6 py-4">{move.toWarehouseId}</td>
                                <td className="px-6 py-4 font-bold">{move.quantityToMove}</td>
                                <td className="px-6 py-4 text-xs text-muted-foreground">{move.reason}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="p-6 bg-slate-50 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <h4 className="text-sm font-bold flex items-center gap-2">
                             <TrendingUp className="w-4 h-4 text-green-500" />
                             Quantifiable Impact
                           </h4>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-white rounded-lg border">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Prev. Stockouts</p>
                                <p className="text-lg font-bold text-green-600">{plan.potentialImpact.preventedStockouts.length}</p>
                              </div>
                              <div className="p-3 bg-white rounded-lg border">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Est. Savings</p>
                                <p className="text-lg font-bold text-primary">${plan.potentialImpact.estimatedCostSavings?.toLocaleString() || "4.2k"}</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <h4 className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
                             <AlertCircle className="w-4 h-4" />
                             Risks Prevented
                           </h4>
                           <div className="flex flex-wrap gap-2">
                             {plan.potentialImpact.preventedStockouts.map((item, idx) => (
                               <Badge key={idx} variant="secondary" className="bg-white">{item}</Badge>
                             ))}
                           </div>
                        </div>
                      </div>
                    </CardContent>
                 </div>
               )}
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
