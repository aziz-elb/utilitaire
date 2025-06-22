import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getInitials, capitalizeFirst } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  DollarSign,
  FileText,
  Activity,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: FolderKanban, label: "Projets", path: "/projects" },
  { icon: Layers, label: "Templates", path: "/template" },
  { icon: Users, label: "Membres", path: "/members" },
  { icon: DollarSign, label: "Budget & KPIs", path: "/budget" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: Activity, label: "Historique", path: "/activity" },
  { icon: BarChart3, label: "Rapports", path: "/reports" },
];

const menuItems2 = [
  { icon: Settings, label: "Paramètres", path: "/settings" },
  { icon: HelpCircle, label: "Help", path: "/help" },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div
      className={cn(
        "bg-sidebar-background border-r border-sidebar-accent transition-all duration-300 flex flex-col h-screen",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-accent flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground">Inwi PM</h1>
              <p className="text-xs text-[hsl(210,40%,90%)]">
                Gestion de projets SI
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
                collapsed && "justify-center"
              )}
            >
              <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Navigation secondaire (Paramètres et Help) */}
      <div className="px-3 pb-4">
        <div className={cn("space-y-1", collapsed ? "px-0" : "px-0")}>
          {menuItems2.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors", // Augmenté py-2 à py-3
                  isActive
                    ? "bg-sidebar-primary text-sidebar-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
