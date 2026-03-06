
"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Activity,
  Route,
  Package,
  Boxes,
  ShieldAlert,
  Settings,
  Database,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Overview",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Digital Twin",
    url: "/digital-twin",
    icon: Activity,
  },
  {
    title: "Route Optimization",
    url: "/logistics",
    icon: Route,
  },
  {
    title: "Inventory Rebalancing",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Supplier Risk",
    url: "/suppliers",
    icon: ShieldAlert,
  },
  {
    title: "Supply Chain Digital Twin",
    url: "http://localhost:5173/digital",
    icon: ShieldAlert,
  },
  

];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            S
          </div>
          <span className="font-headline font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden">
            SynchroChain
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Database">
              <Database className="w-4 h-4" />
              <span>MongoDB Sync</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
