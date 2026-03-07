
"use client";

import { useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Route as RouteIcon, 
  Truck, 
  Clock, 
  DollarSign, 
  Leaf, 
  Zap, 
  AlertTriangle, 
  ArrowRight,
  Loader2,
  RefreshCw,
  Ship,
  Plane,
  Train
} from "lucide-react";
import { dynamicRouteOptimization, type DynamicRouteOptimizationOutput } from "@/ai/flows/dynamic-route-optimization";
import { toast } from "@/hooks/use-toast";

export default function LogisticsPage() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<DynamicRouteOptimizationOutput | null>(null);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await dynamicRouteOptimization({
        currentRoute: {
          origin: "Shenzhen Port, CN",
          destination: "Chicago Distribution Center, US",
          segments: [
            { mode: "ship", startLocation: "Shenzhen", endLocation: "Long Beach", estimatedTimeHours: 336, estimatedCost: 12000, estimatedCo2EmissionsKg: 5000 },
            { mode: "truck", startLocation: "Long Beach", endLocation: "Chicago", estimatedTimeHours: 48, estimatedCost: 4500, estimatedCo2EmissionsKg: 800 },
          ]
        },
        disruption: {
          location: "Long Beach Port",
          type: "Congestion / Labor Strike",
          impactDescription: "Vessels currently facing 10-14 day berth delays. Port handling efficiency reduced by 60%.",
          affectedSegments: [0]
        },
        optimizationCriteria: {
          costWeight: 0.2,
          timeWeight: 0.6,
          sustainabilityWeight: 0.2
        }
      });
      setResults(result);
      toast({
        title: "Routes Optimized",
        description: "Found new multi-modal alternatives to bypass disruption.",
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Failed to calculate reroute options.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'ship': return <Ship className="w-4 h-4" />;
      case 'air': return <Plane className="w-4 h-4" />;
      case 'train': return <Train className="w-4 h-4" />;
      case 'truck': return <Truck className="w-4 h-4" />;
      default: return <Truck className="w-4 h-4" />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger />
          <h1 className="text-lg font-headline font-bold">Logistics Route Optimization</h1>
        </header>

        <main className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-headline">Disruption Management</h2>
              <p className="text-sm text-muted-foreground">Dynamic multi-modal rerouting for active shipments</p>
            </div>
            <Button onClick={handleOptimize} disabled={isOptimizing} className="gap-2 h-12 px-6">
              {isOptimizing ? <Loader2 className="animate-spin" /> : <RefreshCw />}
              {isOptimizing ? "Calculating Reroutes..." : "Optimize Active Routes"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  Active Disruptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="destructive" className="uppercase text-[10px]">High Impact</Badge>
                    <span className="text-[10px] text-muted-foreground font-bold">ID: DIS-992</span>
                  </div>
                  <h4 className="font-bold text-sm">Long Beach Port Strike</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Local 13 labor dispute causing massive backlogs. Current wait time for berthing exceeds 12 days.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-destructive uppercase">
                    <Zap className="w-3 h-3 fill-current" />
                    82 Active Shipments Affected
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden min-h-[400px] relative">
              {!results && !isOptimizing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-50/30">
                  <RouteIcon className="w-16 h-16 text-muted-foreground/20 mb-4" />
                  <h3 className="text-lg font-bold">No Active Reroute Plans</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-2">
                    Start optimization to find the best balance between cost, speed, and carbon footprint during the current disruption.
                  </p>
                </div>
              )}

              {isOptimizing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-sm font-bold animate-pulse">AI Agent analyzing multi-modal capacity...</p>
                </div>
              )}

              {results && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CardHeader className="bg-muted/5 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle>Recommended Reroute Options</CardTitle>
                      <Badge className="bg-primary">{results.rerouteOptions.length} Strategies Found</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {results.rerouteOptions.map((option) => (
                      <div key={option.id} className="p-5 rounded-xl border border-border hover:border-primary/30 transition-all bg-card shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">Route Option: {option.id}</span>
                              <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">
                                {Math.round(option.confidenceScore * 100)}% Confidence
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground italic">"{option.rationale}"</p>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="space-y-1">
                              <p className="text-[10px] text-muted-foreground uppercase font-bold">Time</p>
                              <div className="flex items-center justify-center gap-1 text-sm font-bold">
                                <Clock className="w-3 h-3 text-blue-500" />
                                {option.totalEstimatedTimeHours}h
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] text-muted-foreground uppercase font-bold">Cost</p>
                              <div className="flex items-center justify-center gap-1 text-sm font-bold">
                                <DollarSign className="w-3 h-3 text-green-500" />
                                ${option.totalEstimatedCost.toLocaleString()}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] text-muted-foreground uppercase font-bold">CO₂</p>
                              <div className="flex items-center justify-center gap-1 text-sm font-bold">
                                <Leaf className="w-3 h-3 text-emerald-500" />
                                {option.totalEstimatedCo2EmissionsKg}kg
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="relative flex flex-col md:flex-row items-center gap-4 py-4 bg-muted/10 rounded-lg px-4 overflow-x-auto">
                          {option.newRoute.segments.map((seg, idx) => (
                            <div key={idx} className="flex items-center gap-4 shrink-0">
                              <div className="flex flex-col items-center gap-1">
                                <div className="p-2 rounded-full bg-white border shadow-sm text-primary">
                                  {getModeIcon(seg.mode)}
                                </div>
                                <span className="text-[10px] font-bold uppercase">{seg.mode}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold">{seg.startLocation}</span>
                                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs font-bold">{seg.endLocation}</span>
                              </div>
                              {idx < option.newRoute.segments.length - 1 && (
                                <div className="hidden md:block w-8 h-px bg-border" />
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                           <Button size="sm" className="gap-2">Deploy This Route <Zap className="w-3 h-3 fill-current" /></Button>
                        </div>
                      </div>
                    ))}
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
