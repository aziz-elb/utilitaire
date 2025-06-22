
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Activity,
  DollarSign,
  Users,
  FolderKanban
} from 'lucide-react';

const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('3months');

  // Data for charts
  const projectStatusData = [
    { name: 'En cours', value: 2, color: '#3b82f6' },
    { name: 'Planifié', value: 1, color: '#f59e0b' },
    { name: 'En attente', value: 1, color: '#6b7280' },
    { name: 'Terminé', value: 0, color: '#10b981' }
  ];

  const budgetProgressData = [
    { project: 'Migration 5G', alloue: 1200, consomme: 900, progression: 75 },
    { project: 'IoT Platform', alloue: 800, consomme: 360, progression: 45 },
    { project: 'CRM Upgrade', alloue: 600, consomme: 90, progression: 15 },
    { project: 'Sécurité Infra', alloue: 950, consomme: 47.5, progression: 5 }
  ];

  const monthlyProgressData = [
    { month: 'Jan', projets: 1, budget: 1200, progression: 10 },
    { month: 'Fév', projets: 2, budget: 2000, progression: 25 },
    { month: 'Mar', projets: 3, budget: 2800, progression: 40 },
    { month: 'Avr', projets: 4, budget: 3550, progression: 55 },
    { month: 'Mai', projets: 4, budget: 3550, progression: 60 },
    { month: 'Juin', projets: 4, budget: 3550, progression: 65 }
  ];

  const categoryDistribution = [
    { name: 'Infrastructure', value: 2, color: '#541a56' },
    { name: 'Digital', value: 1, color: '#ea580c' },
    { name: 'Business', value: 1, color: '#0ea5e9' },
    { name: 'Sécurité', value: 1, color: '#dc2626' }
  ];

  const teamProductivityData = [
    { manager: 'Ahmed B.', projets: 1, progression: 75, budget: 90 },
    { manager: 'Fatima Z.', projets: 1, progression: 45, budget: 45 },
    { manager: 'Omar A.', projets: 1, progression: 15, budget: 15 },
    { manager: 'Laila B.', projets: 1, progression: 5, budget: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports & Analytics</h1>
          <p className="text-gray-600">Tableaux de bord et analyses de performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 mois</SelectItem>
              <SelectItem value="3months">3 mois</SelectItem>
              <SelectItem value="6months">6 mois</SelectItem>
              <SelectItem value="1year">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projets Actifs</p>
                <p className="text-2xl font-bold text-inwi-primary">4</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +25% ce mois
                </p>
              </div>
              <FolderKanban className="h-8 w-8 text-inwi-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Total</p>
                <p className="text-2xl font-bold text-inwi-primary">3.55M</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% ce mois
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progression Moy.</p>
                <p className="text-2xl font-bold text-inwi-primary">35%</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -5% ce mois
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Équipes</p>
                <p className="text-2xl font-bold text-inwi-primary">23</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3 ce mois
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="budget">Budget & ROI</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="teams">Équipes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Statuts</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Progress Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="progression" 
                    stackId="1" 
                    stroke="#541a56" 
                    fill="#541a56" 
                    fillOpacity={0.6}
                    name="Progression (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          {/* Budget vs Consumption */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Alloué vs Consommé</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={budgetProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="project" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="alloue" fill="#541a56" name="Budget Alloué (K MAD)" />
                  <Bar dataKey="consomme" fill="#ea580c" name="Budget Consommé (K MAD)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Project Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance des Projets</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={budgetProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="project" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="progression" 
                    stroke="#541a56" 
                    strokeWidth={3}
                    name="Progression (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          {/* Team Productivity */}
          <Card>
            <CardHeader>
              <CardTitle>Productivité des Équipes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={teamProductivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="manager" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="progression" fill="#541a56" name="Progression (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Team Stats Table */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des Équipes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamProductivityData.map((team, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-inwi-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {team.manager.split(' ')[0][0]}{team.manager.split(' ')[1]?.[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{team.manager}</h4>
                        <p className="text-sm text-gray-500">{team.projets} projet(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-inwi-primary">{team.progression}%</p>
                        <p className="text-xs text-gray-500">Progression</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{team.budget}%</p>
                        <p className="text-xs text-gray-500">Budget</p>
                      </div>
                      <Badge className={
                        team.progression >= 60 ? 'bg-green-100 text-green-800' :
                        team.progression >= 30 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {team.progression >= 60 ? 'Excellent' :
                         team.progression >= 30 ? 'Correct' : 'À améliorer'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
