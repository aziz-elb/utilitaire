
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Edit
} from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  // const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@inwi.ma',
    phone: '+212 6 12 34 56 78',
    role: 'Administrateur',
    department: 'DSI'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    projects: true,
    budget: true,
    reports: false
  });

  const [teamMembers] = useState([
    { id: 1, name: 'Ahmed Bennani', email: 'ahmed.bennani@inwi.ma', role: 'Chef de Projet', status: 'Actif' },
    { id: 2, name: 'Fatima Zahra', email: 'fatima.zahra@inwi.ma', role: 'Chef de Projet', status: 'Actif' },
    { id: 3, name: 'Omar Alami', email: 'omar.alami@inwi.ma', role: 'Analyste', status: 'Inactif' },
    { id: 4, name: 'Laila Benali', email: 'laila.benali@inwi.ma', role: 'Architecte', status: 'Actif' }
  ]);

  const handleSaveProfile = () => {
    console.log({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès."
    });
  };

  const handleSaveNotifications = () => {
    console.log({
      title: "Préférences sauvegardées",
      description: "Vos préférences de notification ont été mises à jour."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Configurez votre compte et les préférences de l'application</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          {/* <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Équipe
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Système
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Select value={profileData.department} onValueChange={(value) => setProfileData({ ...profileData, department: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DSI">DSI</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="RH">Ressources Humaines</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="bg-inwi-gradient">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Préférences d'Affichage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Langue</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fuseau horaire</Label>
                  <Select defaultValue="casablanca">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casablanca">Casablanca (GMT)</SelectItem>
                      <SelectItem value="paris">Paris (GMT+1)</SelectItem>
                      <SelectItem value="london">London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
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
                    <p className="text-sm text-gray-500">Recevoir les mises à jour par email</p>
                  </div>
                  <Switch
                  className='bg-inwi-purple'
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications push</Label>
                    <p className="text-sm text-gray-500">Notifications dans le navigateur</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mises à jour des projets</Label>
                    <p className="text-sm text-gray-500">Progression et jalons des projets</p>
                  </div>
                  <Switch
                    checked={notifications.projects}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, projects: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes budget</Label>
                    <p className="text-sm text-gray-500">Dépassements et seuils budgétaires</p>
                  </div>
                  <Switch
                    checked={notifications.budget}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, budget: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rapports hebdomadaires</Label>
                    <p className="text-sm text-gray-500">Résumé d'activité chaque semaine</p>
                  </div>
                  <Switch
                    checked={notifications.reports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, reports: checked })}
                  />
                </div>
              </div>

              <Separator />
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} className="bg-inwi-gradient">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité du Compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Mot de passe actuel</Label>
                  <Input type="password" placeholder="Entrez votre mot de passe actuel" />
                </div>
                <div>
                  <Label>Nouveau mot de passe</Label>
                  <Input type="password" placeholder="Nouveau mot de passe" />
                </div>
                <div>
                  <Label>Confirmer le mot de passe</Label>
                  <Input type="password" placeholder="Confirmez le nouveau mot de passe" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Authentification à deux facteurs</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>2FA activé</Label>
                    <p className="text-sm text-gray-500">Sécurité renforcée pour votre compte</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">Activé</Badge>
                </div>
              </div>

              <Separator />
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Annuler</Button>
                <Button className="bg-inwi-gradient">Modifier le mot de passe</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Gestion de l'Équipe
                </CardTitle>
                <Button className="bg-inwi-gradient">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Inviter Membre
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-inwi-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={member.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {member.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configuration Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Version de l'application</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">Inwi PM v2.1.0</p>
                    <p className="text-sm text-gray-500">Dernière mise à jour: 15 Mai 2024</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Base de données</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">PostgreSQL 14.2</p>
                    <p className="text-sm text-gray-500">Statut: Connecté</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Actions Système</h4>
                <div className="flex space-x-2">
                  <Button variant="outline">Sauvegarder Base</Button>
                  <Button variant="outline">Nettoyer Cache</Button>
                  <Button variant="outline" className="text-red-600">Redémarrer Service</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Logs Système</h4>
                <div className="p-4 bg-gray-50 rounded-md font-mono text-sm max-h-40 overflow-y-auto">
                  <p>[2024-06-13 10:30:15] INFO: Utilisateur admin connecté</p>
                  <p>[2024-06-13 10:25:43] INFO: Projet "Migration 5G" mis à jour</p>
                  <p>[2024-06-13 10:20:12] INFO: Sauvegarde automatique effectuée</p>
                  <p>[2024-06-13 10:15:08] WARNING: Consommation mémoire élevée</p>
                  <p>[2024-06-13 10:10:05] INFO: Service démarré</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
