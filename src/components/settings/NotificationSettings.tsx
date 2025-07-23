import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bell, Save } from "lucide-react";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    projects: true,
    budget: false,
    reports: true,
  });

  const handleSaveNotifications = () => {
    // Statique : juste un log ou un alert
    alert("Préférences de notification sauvegardées (statique)");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Préférences de Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications par email</Label>
              <p className="text-sm text-gray-500">
                Recevoir les mises à jour par email
              </p>
            </div>
            <Switch
              className="bg-inwi-purple"
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, email: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications push</Label>
              <p className="text-sm text-gray-500">
                Notifications dans le navigateur
              </p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, push: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mises à jour des projets</Label>
              <p className="text-sm text-gray-500">
                Progression et jalons des projets
              </p>
            </div>
            <Switch
              checked={notifications.projects}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, projects: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alertes budget</Label>
              <p className="text-sm text-gray-500">
                Dépassements et seuils budgétaires
              </p>
            </div>
            <Switch
              checked={notifications.budget}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, budget: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rapports hebdomadaires</Label>
              <p className="text-sm text-gray-500">
                Résumé d'activité chaque semaine
              </p>
            </div>
            <Switch
              checked={notifications.reports}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, reports: checked })
              }
            />
          </div>
        </div>

        <Separator />
        <div className="flex justify-end">
          <Button
            onClick={handleSaveNotifications}
            className="bg-inwi-gradient"
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
