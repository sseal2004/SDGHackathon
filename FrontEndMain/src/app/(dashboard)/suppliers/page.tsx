
"use client";

import { useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  Search, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle,
  ExternalLink,
  Loader2,
  Info
} from "lucide-react";
import { predictiveSupplierRiskAnalysis, type PredictiveSupplierRiskAnalysisOutput } from "@/ai/flows/predictive-supplier-risk-analysis";

const suppliersList = [
  { name: "Alpha Logistics GMBH", risk: "Low", rating: 92 },
  { name: "Sino-Export Co.", risk: "High", rating: 45 },
  { name: "Trans-Pacific Shipping", risk: "Medium", rating: 78 },
  { name: "Euro-Parts Hub", risk: "Low", rating: 89 },
];

export default function SuppliersPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PredictiveSupplierRiskAnalysisOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeSupplier = async (name: string) => {
    setSelectedSupplier(name);
    setLoading(true);
    try {
      const res = await predictiveSupplierRiskAnalysis({
        supplierName: name,
        historicalDataSummary: "On-time rate 88%. Recent quality issues in batch B-22. Communication lag: 4h.",
        currentOrdersSummary: "3 outstanding orders. Delivery due in 12 days.",
        externalContext: "Regional labor strikes reported in the supplier's manufacturing district.",
      });
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger />
          <h1 className="text-lg font-headline font-bold">Predictive Supplier Risk</h1>
        </header>

        <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle>Supplier Portfolio</CardTitle>
              <CardDescription>Live tracking of supplier performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border bg-muted/20" placeholder="Search suppliers..." />
              </div>

              <div className="space-y-2">
                {suppliersList.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => analyzeSupplier(s.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      selectedSupplier === s.name ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-transparent bg-muted/10 hover:bg-muted/30"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-bold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">Rating: {s.rating}%</p>
                    </div>
                    <Badge variant={s.risk === "High" ? "destructive" : s.risk === "Medium" ? "secondary" : "outline"}>
                      {s.risk}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden relative">
            {!selectedSupplier && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 z-10 text-center p-8">
                <ShieldAlert className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold font-headline">Select a supplier to begin risk analysis</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">AI-powered predictive forecasting requires supplier context for accurate results.</p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-sm font-bold animate-pulse">Running AI Predictive Modeling...</p>
              </div>
            )}

            {analysis && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <CardHeader className="border-b bg-muted/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold">{analysis.supplierName}</CardTitle>
                      <CardDescription>Generated forecast based on historical and current market data</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase text-muted-foreground">Reliability Score</p>
                      <p className="text-3xl font-bold text-primary">{analysis.reliabilityForecast.overallScore}%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        Predicted Issues
                      </h4>
                      <div className="space-y-3">
                        {analysis.predictedIssues.map((issue, i) => (
                          <div key={i} className="p-3 rounded-lg border bg-muted/10 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold">{issue.issueType}</span>
                              <Badge variant={issue.likelihood === "High" ? "destructive" : "secondary"}>
                                {issue.likelihood} Likelihood
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{issue.potentialImpact}</p>
                            {issue.estimatedDelayDays && (
                              <p className="text-[10px] font-bold text-destructive">Est. Delay: {issue.estimatedDelayDays} days</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Actionable Insights
                      </h4>
                      <div className="space-y-2">
                        {analysis.actionableInsights.map((insight, i) => (
                          <div key={i} className="flex gap-2 p-3 rounded-lg bg-primary/5 text-xs leading-relaxed border border-primary/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />
                            {insight}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">AI Confidence Level: <strong>{analysis.aiConfidence}%</strong></span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" /> Export Report
                    </Button>
                  </div>
                </CardContent>
              </div>
            )}
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
