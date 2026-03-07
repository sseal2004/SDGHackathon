
"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Truck, 
  Warehouse, 
  CheckCircle2, 
  Clock,
  Activity
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell
} from "recharts";
import { useState, useEffect } from "react";

const data = [
  { name: "Mon", cost: 4000, risk: 2400 },
  { name: "Tue", cost: 3000, risk: 1398 },
  { name: "Wed", cost: 2000, risk: 9800 },
  { name: "Thu", cost: 2780, risk: 3908 },
  { name: "Fri", cost: 1890, risk: 4800 },
  { name: "Sat", cost: 2390, risk: 3800 },
  { name: "Sun", cost: 3490, risk: 4300 },
];

const stats = [
  { label: "Total Shipments", value: "1,284", change: "+12.5%", icon: Truck, color: "text-primary" },
  { label: "Critical Alerts", value: "4", change: "-2", icon: AlertTriangle, color: "text-destructive" },
  { label: "Inventory Health", value: "94.2%", change: "+0.8%", icon: CheckCircle2, color: "text-accent" },
  { label: "Avg Lead Time", value: "3.2 Days", change: "-12m", icon: Clock, color: "text-muted-foreground" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-bold text-foreground">Supply Chain Command Center</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
              <CheckCircle2 className="w-3 h-3" /> System Live
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-none shadow-sm bg-white/80 hover:bg-white transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      stat.change.startsWith("+") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold font-headline">{stat.value}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none shadow-sm bg-white/80">
              <CardHeader>
                <CardTitle className="font-headline">Network Cost vs Risk Analysis</CardTitle>
                <CardDescription>Real-time data from multi-source integration (GPS, ERP, Warehouse)</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Line type="monotone" dataKey="cost" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="risk" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white/80">
              <CardHeader>
                <CardTitle className="font-headline">Critical Smart Alerts</CardTitle>
                <CardDescription>Priority notifications based on SKU criticality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Supplier Disruption", msg: "Region 4 Port Strike impact likely", level: "Critical", time: "2m ago" },
                    { title: "Inventory Rebalance", msg: "Move SKU-X82 to Warehouse B", level: "Action Required", time: "15m ago" },
                    { title: "Route Optimized", msg: "Rerouted shipment #482 due to storm", level: "Info", time: "1h ago" },
                  ].map((alert, i) => (
                    <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        alert.level === "Critical" ? "bg-red-500 animate-pulse" : 
                        alert.level === "Action Required" ? "bg-amber-500" : "bg-blue-500"
                      }`} />
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-bold">{alert.title}</p>
                          <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{alert.msg}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-white/80 overflow-hidden">
               <div className="h-2 bg-primary" />
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Warehouse className="w-5 h-5 text-primary" />
                  Warehouse Utilization
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Chicago', val: 82 },
                    { name: 'Long Beach', val: 95 },
                    { name: 'Atlanta', val: 64 },
                    { name: 'Newark', val: 78 },
                  ]}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                      {
                        [82, 95, 64, 78].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry > 90 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white/80 overflow-hidden">
              <div className="h-2 bg-accent" />
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  Eco-Efficiency Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center h-[200px]">
                <div className="relative h-48 w-48 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[12px] border-muted" />
                  <div className="absolute inset-0 rounded-full border-[12px] border-accent border-t-transparent -rotate-45" />
                  <div className="text-center">
                    <p className="text-4xl font-bold font-headline">88%</p>
                    <p className="text-xs text-muted-foreground">CO₂ Reduction Goal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
