import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getInitials, capitalizeFirst } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  HelpCircle,
  LogOut,
  Bell,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: FolderKanban, label: "Projets", path: "/projects" },
  { icon: Layers, label: "Templates", path: "/template" },
  { icon: Users, label: "Membres", path: "/members" },
  { icon: DollarSign, label: "Budget & KPIs", path: "/budget" },
  // { icon: FileText, label: "Documents", path: "/documents" },
  // { icon: Activity, label: "Historique", path: "/activity" },
  // { icon: BarChart3, label: "Rapports", path: "/reports" },
];

const menuItems2 = [
  { icon: Settings, label: "Paramètres", path: "/settings" },
  { icon: HelpCircle, label: "Help", path: "/help" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "bg-sidebar-background border-r border-sidebar-accent transition-all duration-300 flex flex-col h-screen text-sidebar-foreground",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20 flex items-center justify-between bg-sidebar-background">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-inwi-pink/90 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <div>
              <h1 className="font-bold text-white">Inwi PM</h1>
              <p className="text-xs text-white">Gestion de projets SI</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 text-white hover:bg-inwi-pink hover:text-white"
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
                  ? "bg-inwi-pink/90 text-white"
                  : "text-white hover:bg-inwi-pink/30",
                collapsed && "justify-center"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  !collapsed && "mr-3",
                  "text-sidebar-foreground text-white"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Navigation secondaire (Paramètres et Help) */}
      {/* <div className="px-3 pb-4">
        <div className={cn("space-y-1", collapsed ? "px-0" : "px-0")}>
          {" "}
          {menuItems2.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors", // Augmenté py-2 à py-3
                  isActive
                    ? "bg-inwi-pink/90 text-white"
                    : "text-white hover:bg-inwi-pink/30",
                  collapsed && "justify-center"
                )}
              >
                <item.icon
                  className={cn("h-5 w-5", !collapsed && "mr-3", "text-white")}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div> */}
      <div className="px-3 pb-4 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {collapsed ? (
              // Avatar seul, centré, sans hover
              <div className="flex items-center justify-center">
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage
                    src={user?.profilePictureUrl}
                    alt="profile picture"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-inwi-pink/60 to-inwi-pink text-white border-1 border-white/20">
                    {getInitials(
                      user?.nomPrenom.split(" ")[0],
                      user?.nomPrenom.split(" ")[1]
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              // Bloc avatar + nom + email, hover rose
              <div className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-inwi-pink/30 transition">
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage
                    src={user?.profilePictureUrl}
                    alt="profile picture"
                  />

                  <AvatarFallback className="bg-gradient-to-r from-inwi-pink/60 to-inwi-pink text-white border-1 border-white/20">
                    {getInitials(
                      user?.nomPrenom.split(" ")[0],
                      user?.nomPrenom.split(" ")[1]
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-white leading-tight">
                    {user?.nomPrenom ?? "Utilisateur"}
                  </span>
                  <span className="text-xs text-white/80">
                    {user?.email ?? "email inconnu"}
                  </span>
                </div>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={collapsed ? "right" : "end"}
            side={collapsed ? "right" : "top"}
            className="w-56"
          >
            <div className="flex items-center gap-2 p-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.profilePictureUrl}
                  alt="profile picture"
                />
                <AvatarFallback className="bg-gradient-to-r from-inwi-purple/60 to-inwi-dark-purple text-white border-1 border-white/20">
                  {getInitials(
                    user?.nomPrenom.split(" ")[0],
                    user?.nomPrenom.split(" ")[1]
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {user?.nomPrenom ?? "Utilisateur"}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email ?? "email inconnu"}
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings/profile")}>
              <UserIcon className="mr-2 h-4 w-4" /> Account
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/settings/notifications")}
            >
              <Bell className="mr-2 h-4 w-4" /> Notifications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/help")}>
              <HelpCircle className="mr-2 h-4 w-4" /> Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
