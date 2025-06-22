
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  Building,
  UserCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Members: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const members = [
    {
      id: 1,
      name: 'Ahmed Bennani',
      email: 'ahmed.bennani@inwi.ma',
      phone: '+212 6 12 34 56 78',
      role: 'Chef de Projet Senior',
      entity: 'Direction SI',
      function: 'Management',
      status: 'Actif',
      type: 'Interne',
      projects: 3,
      lastLogin: '2024-01-15',
      avatar: null
    },
    {
      id: 2,
      name: 'Fatima Zahra Alami',
      email: 'fatima.alami@inwi.ma',
      phone: '+212 6 23 45 67 89',
      role: 'Architecte Solution',
      entity: 'Direction Technique',
      function: 'Technique',
      status: 'Actif',
      type: 'Interne',
      projects: 2,
      lastLogin: '2024-01-14',
      avatar: null
    },
    {
      id: 3,
      name: 'Omar Riad',
      email: 'omar.riad@consultant.com',
      phone: '+212 6 34 56 78 90',
      role: 'Consultant DevOps',
      entity: 'Externe - DevCorp',
      function: 'Technique',
      status: 'Actif',
      type: 'Externe',
      projects: 1,
      lastLogin: '2024-01-15',
      avatar: null
    },
    {
      id: 4,
      name: 'Laila Benali',
      email: 'laila.benali@inwi.ma',
      phone: '+212 6 45 67 89 01',
      role: 'Responsable Sécurité',
      entity: 'Direction Sécurité',
      function: 'Sécurité',
      status: 'Actif',
      type: 'Interne',
      projects: 4,
      lastLogin: '2024-01-13',
      avatar: null
    },
    {
      id: 5,
      name: 'Youssef Kadiri',
      email: 'youssef.kadiri@inwi.ma',
      phone: '+212 6 56 78 90 12',
      role: 'Développeur Senior',
      entity: 'Direction SI',
      function: 'Développement',
      status: 'Inactif',
      type: 'Interne',
      projects: 0,
      lastLogin: '2024-01-05',
      avatar: null
    },
    {
      id: 6,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+33 6 12 34 56 78',
      role: 'Expert BI',
      entity: 'Externe - TechCorp',
      function: 'Analyse',
      status: 'Actif',
      type: 'Externe',
      projects: 1,
      lastLogin: '2024-01-14',
      avatar: null
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getTypeColor = (type: string) => {
    return type === 'Interne' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.entity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Membres</h1>
          <p className="text-gray-600">Administration des utilisateurs et de leurs rôles</p>
        </div>
        {/* <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"> */}
        <Button >

          <Plus className="h-4 w-4 mr-2" />
          Nouveau Membre
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des membres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.status === 'Actif').length}
              </div>
              <div className="text-sm text-gray-600">Membres actifs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {members.filter(m => m.type === 'Interne').length}
              </div>
              <div className="text-sm text-gray-600">Internes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {members.filter(m => m.type === 'Externe').length}
              </div>
              <div className="text-sm text-gray-600">Externes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(members.reduce((acc, m) => acc + m.projects, 0) / members.length * 10) / 10}
              </div>
              <div className="text-sm text-gray-600">Projets/membre</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-inwi-dark-purple to-inwi-secondary-color text-white">
                    {/* <AvatarFallback > */}
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Voir profil</DropdownMenuItem>
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    <DropdownMenuItem>Gérer rôles</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Désactiver</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center space-x-2 mt-3">
                <Badge className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
                <Badge className={getTypeColor(member.type)}>
                  {member.type}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  <span className="truncate">{member.entity}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{member.projects}</div>
                  <div className="text-xs text-gray-600">Projets</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">{member.function}</div>
                  <div className="text-xs text-gray-600">Fonction</div>
                </div>
              </div>

              {/* Last Login */}
              <div className="pt-2 border-t">
                <div className="flex items-center text-xs text-gray-500">
                  <UserCheck className="h-3 w-3 mr-1" />
                  <span>Dernière connexion: {new Date(member.lastLogin).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Members;
