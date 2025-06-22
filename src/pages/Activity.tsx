
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  Calendar,
  User,
  FileText,
  Edit,
  Trash,
  Plus,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Activity {
  id: number;
  type: 'create' | 'update' | 'delete' | 'complete' | 'comment';
  title: string;
  description: string;
  user: string;
  timestamp: string;
  project: string;
  category: string;
}

const Activity: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  const activities: Activity[] = [
    {
      id: 1,
      type: 'create',
      title: 'Nouveau projet créé',
      description: 'Migration Core Network 5G a été créé avec un budget de 1.2M MAD',
      user: 'Ahmed Bennani',
      timestamp: '2024-01-15T10:30:00',
      project: 'Migration Core Network 5G',
      category: 'Projet'
    },
    {
      id: 2,
      type: 'update',
      title: 'Progression mise à jour',
      description: 'Progression du projet IoT Platform mise à jour de 40% à 45%',
      user: 'Fatima Zahra',
      timestamp: '2024-03-12T14:20:00',
      project: 'Déploiement IoT Platform',
      category: 'Progression'
    },
    {
      id: 3,
      type: 'comment',
      title: 'Commentaire ajouté',
      description: 'Révision nécessaire des spécifications techniques avant validation',
      user: 'Omar Alami',
      timestamp: '2024-03-10T09:15:00',
      project: 'Upgrade CRM System',
      category: 'Commentaire'
    },
    {
      id: 4,
      type: 'complete',
      title: 'Jalon complété',
      description: 'Phase 1 de sécurisation terminée avec succès',
      user: 'Laila Benali',
      timestamp: '2024-02-28T16:45:00',
      project: 'Sécurisation Infrastructure',
      category: 'Jalon'
    },
    {
      id: 5,
      type: 'update',
      title: 'Budget modifié',
      description: 'Budget alloué augmenté de 800K à 950K MAD',
      user: 'Ahmed Bennani',
      timestamp: '2024-02-20T11:00:00',
      project: 'Migration Core Network 5G',
      category: 'Budget'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <Plus className="h-5 w-5 text-green-500" />;
      case 'update': return <Edit className="h-5 w-5 text-blue-500" />;
      case 'delete': return <Trash className="h-5 w-5 text-red-500" />;
      case 'complete': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'comment': return <FileText className="h-5 w-5 text-purple-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'complete': return 'bg-green-100 text-green-800';
      case 'comment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'create': return 'Creation';
      case 'update': return 'Modification';
      case 'delete': return 'Suppression';
      case 'complete': return 'Completion';
      case 'comment': return 'Commentaire';
      default: return 'Autre';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesProject = projectFilter === 'all' || activity.project === projectFilter;
    const matchesUser = userFilter === 'all' || activity.user === userFilter;

    return matchesSearch && matchesType && matchesProject && matchesUser;
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      return 'Il y a moins d\'une heure';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)} heure${Math.floor(diffInHours) > 1 ? 's' : ''}`;
    } else if (diffInDays < 7) {
      return `Il y a ${Math.floor(diffInDays)} jour${Math.floor(diffInDays) > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historique des Activités</h1>
          <p className="text-gray-600">Suivi des actions et modifications sur les projets</p>
        </div>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Exporter Historique
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Plus className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{activities.filter(a => a.type === 'create').length}</p>
                <p className="text-sm text-gray-600">Créations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Edit className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{activities.filter(a => a.type === 'update').length}</p>
                <p className="text-sm text-gray-600">Modifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{activities.filter(a => a.type === 'complete').length}</p>
                <p className="text-sm text-gray-600">Complétions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{activities.filter(a => a.type === 'comment').length}</p>
                <p className="text-sm text-gray-600">Commentaires</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-inwi-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{activities.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans l'historique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type d'action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes actions</SelectItem>
                <SelectItem value="create">Création</SelectItem>
                <SelectItem value="update">Modification</SelectItem>
                <SelectItem value="complete">Completion</SelectItem>
                <SelectItem value="comment">Commentaire</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Projet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous projets</SelectItem>
                <SelectItem value="Migration Core Network 5G">Migration Core Network 5G</SelectItem>
                <SelectItem value="Déploiement IoT Platform">Déploiement IoT Platform</SelectItem>
                <SelectItem value="Upgrade CRM System">Upgrade CRM System</SelectItem>
                <SelectItem value="Sécurisation Infrastructure">Sécurisation Infrastructure</SelectItem>
              </SelectContent>
            </Select>

            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Utilisateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous utilisateurs</SelectItem>
                <SelectItem value="Ahmed Bennani">Ahmed Bennani</SelectItem>
                <SelectItem value="Fatima Zahra">Fatima Zahra</SelectItem>
                <SelectItem value="Omar Alami">Omar Alami</SelectItem>
                <SelectItem value="Laila Benali">Laila Benali</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activities Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activités Récentes ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  {index < filteredActivities.length - 1 && (
                    <div className="w-px h-6 bg-gray-200 ml-5 mt-2"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <Badge className={getActivityColor(activity.type)}>
                        {getActivityTypeLabel(activity.type)}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
                  </div>
                  
                  <p className="text-gray-600 mt-1">{activity.description}</p>
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {activity.user}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {activity.project}
                    </div>
                    <Badge variant="outline">{activity.category}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activity;
