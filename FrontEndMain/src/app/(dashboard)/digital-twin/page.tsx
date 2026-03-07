
"use client";

import { useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  RotateCcw, 
  Plus, 
  Map as MapIcon, 
  Zap, 
  Building2, 
  Anchor, 
  Truck,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { digitalTwinScenarioImpact, type DigitalTwinScenarioOutput } from "@/ai/flows/digital-twin-scenario-impact";
import { toast } from "@/hooks/use-toast";

export default function DigitalTwinPage() {
  const [scenario, setScenario] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<DigitalTwinScenarioOutput | null>(null);

  const handleSimulate = async () => {
    if (!scenario) return;
    setIsSimulating(true);
    try {
      const result = await digitalTwinScenarioImpact({
        currentSupplyChainState: "Global network operating at 85% capacity. Port congestion at 15%. Average fuel cost $3.40/gal.",
        scenarioDescription: scenario,
        skuCriticality: { "SKU-PRO-MAX": "high", "SKU-BASIC": "low" },
      });
      setSimulationResult(result);
    } catch (error) {
      toast({
        title: "Simulation Error",
        description: "Failed to generate scenario impact analysis.",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold">Digital Twin Sandbox</h1>
          </div>
          <Badge className="bg-accent text-accent-foreground animate-pulse-glow">
            Live Simulator Active
          </Badge>
        </header>

        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Simulation Canvas */}
            <Card className="flex-1 border-none shadow-md bg-white overflow-hidden relative min-h-[500px]">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-primary" />
                  Network Visualization
                </CardTitle>
                <CardDescription>Drag and drop elements to modify your supply chain structure</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 h-full flex items-center justify-center p-0">
                {/* Simulated World View */}
                <div className="w-full h-full bg-slate-50 relative p-8">
                   {/* This is a visual mock of the interactive canvas */}
                   <div className="absolute top-1/4 left-1/4 group cursor-pointer">
                      <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-primary hover:scale-110 transition-transform flex flex-col items-center gap-2">
                        <Building2 className="text-primary" />
                        <span className="text-[10px] font-bold">CHICAGO WH</span>
                      </div>
                   </div>
                   <div className="absolute top-1/3 right-1/4 group cursor-pointer">
                      <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-accent hover:scale-110 transition-transform flex flex-col items-center gap-2">
                        <Anchor className="text-accent" />
                        <span className="text-[10px] font-bold">LB PORT</span>
                      </div>
                   </div>
                   <div className="absolute bottom-1/4 left-1/2 group cursor-pointer">
                      <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-purple-500 hover:scale-110 transition-transform flex flex-col items-center gap-2">
                        <Truck className="text-purple-500" />
                        <span className="text-[10px] font-bold">LOGISTICS A</span>
                      </div>
                   </div>

                   {/* Animated Paths */}
                   <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <path d="M 250 200 Q 400 250 550 200" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5" fill="transparent" className="animate-[dash_10s_linear_infinite]" />
                      <path d="M 550 200 Q 500 400 450 450" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="5,5" fill="transparent" />
                   </svg>
                   
                   <div className="absolute bottom-6 right-6 flex gap-2">
                      <Button size="sm" variant="outline" className="bg-white"><Plus className="w-4 h-4 mr-2" /> Add Warehouse</Button>
                      <Button size="sm" variant="outline" className="bg-white"><Plus className="w-4 h-4 mr-2" /> Add Route</Button>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {simulationResult && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="bg-red-50 border-red-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-red-700">Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-red-600 leading-relaxed">{simulationResult.predictedImpact.riskAssessment}</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-blue-700">Cost Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-blue-600 font-bold">{simulationResult.predictedImpact.costImpact}</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-green-700">Delivery Outcome</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-green-600 leading-relaxed">{simulationResult.predictedImpact.deliveryOutcome}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <Card className="border-none shadow-md bg-white h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Scenario Engine
                </CardTitle>
                <CardDescription>Define a "What-If" disruption or change</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scenario Prompt</label>
                  <textarea 
                    className="w-full min-h-[120px] p-3 rounded-lg border text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    placeholder="e.g., 'What if the Panama Canal has a 3-week backlog?' or 'What if demand for SKU-82 spikes by 40% in EMEA?'"
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold text-muted-foreground">Confidence Level</label>
                      <span className="text-xs font-bold">85%</span>
                    </div>
                    <Slider defaultValue={[85]} max={100} step={1} className="text-accent" />
                  </div>
                </div>

                <Button 
                  className="w-full h-12 gap-2" 
                  onClick={handleSimulate}
                  disabled={isSimulating || !scenario}
                >
                  {isSimulating ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      Run Simulation
                    </>
                  )}
                </Button>

                {simulationResult && (
                  <div className="space-y-4 pt-4 border-t">
                    <p className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">AI Recommendations</p>
                    <div className="space-y-2">
                      {simulationResult.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-2 p-2 rounded bg-muted/30 text-[11px] leading-tight">
                          <Sparkles className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
