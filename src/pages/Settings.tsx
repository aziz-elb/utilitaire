import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Save,
  UserPlus,
  Trash2,
  Edit,
} from "lucide-react";
import NotificationSettings from "@/components/settings/NotificationSettings";
import GlobalSettings from "@/components/settings/GlobalSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import { useNavigate, useLocation } from "react-router-dom";

const tabList = [
  { value: "profile", label: "Profil", icon: User },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "settings", label: "Settings", icon: User },
];

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get tab from URL (query param or path)
  let urlTab = "profile";
  // Try query param first
  const params = new URLSearchParams(location.search);
  if (params.get("tab")) urlTab = params.get("tab")!;
  // Or from path (/settings/:tab)
  const pathMatch = location.pathname.match(/\/settings\/?([^/]*)/);
  if (pathMatch && pathMatch[1]) urlTab = pathMatch[1];

  const [tab, setTab] = React.useState(urlTab);

  // Sync tab with URL
  React.useEffect(() => {
    setTab(urlTab);
  }, [urlTab]);

  // When tab changes, update URL
  const handleTabChange = (v: string) => {
    setTab(v);
    navigate(`/settings/${v}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">
          Configurez votre compte et les préférences de l'application
        </p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          {tabList.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <AccountSettings />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <GlobalSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
