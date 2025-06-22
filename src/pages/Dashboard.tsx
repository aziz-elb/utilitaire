import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  FolderKanban,
} from "lucide-react";

/// Importatio temporeelee :

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AreaChart,
} from "recharts";
import { Download, Calendar, Activity } from "lucide-react";

const Dashboard: React.FC = () => {
  //Data Tempppoooo

  // Data for charts
  const projectStatusData = [
    { name: "En cours", value: 18, color: "#3b82f6" },
    { name: "Planifié", value: 29, color: "#f59e0b" },
    { name: "En attente", value: 40, color: "#6b7280" },
    { name: "Terminé", value: 30, color: "#10b981" },
  ];

  const budgetProgressData = [
    { project: "Migration 5G", alloue: 1200, consomme: 900, progression: 75 },
    { project: "IoT Platform", alloue: 800, consomme: 360, progression: 45 },
    { project: "CRM Upgrade", alloue: 600, consomme: 90, progression: 15 },
    { project: "Sécurité Infra", alloue: 950, consomme: 47.5, progression: 5 },
  ];

  // End DATA tempooo

  const kpis = [
    {
      title: "Projets Actifs",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: FolderKanban,
      color: "text-blue-600",
    },
    {
      title: "Budget Consommé",
      value: "2.4M MAD",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Membres Actifs",
      value: "156",
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Délais Respectés",
      value: "87%",
      change: "-3%",
      trend: "down",
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  const projects = [
    {
      id: 1,
      name: "Migration Core Network 5G",
      status: "En cours",
      progress: 75,
      budget: "1.2M MAD",
      deadline: "2024-08-15",
      priority: "Haute",
      manager: "Ahmed Bennani",
    },
    {
      id: 2,
      name: "Déploiement IoT Platform",
      status: "En cours",
      progress: 45,
      budget: "800K MAD",
      deadline: "2024-09-30",
      priority: "Moyenne",
      manager: "Fatima Zahra",
    },
    {
      id: 3,
      name: "Upgrade CRM System",
      status: "Planifié",
      progress: 15,
      budget: "600K MAD",
      deadline: "2024-10-20",
      priority: "Basse",
      manager: "Omar Alami",
    },
  ];

  const alerts = [
    {
      type: "warning",
      message:
        'Projet "Migration Core Network 5G" : Risque de dépassement budgétaire de 15%',
      time: "Il y a 2h",
    },
    {
      type: "error",
      message:
        'Retard détecté sur "Déploiement IoT Platform" - 5 jours de retard',
      time: "Il y a 4h",
    },
    {
      type: "success",
      message: 'Jalons atteints pour "Upgrade CRM System"',
      time: "Il y a 1 jour",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Vue d'ensemble de la gouvernance des projets SI
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {kpi.value}
              </div>
              <div className="flex items-center text-xs text-gray-600">
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span
                  className={
                    kpi.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {kpi.change}
                </span>
                <span className="ml-1">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-3 gap-6">
        {/* Projets en cours */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Projets en Cours</CardTitle>
              <CardDescription>
                Suivi de l'avancement des projets prioritaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <Badge
                        variant={
                          project.priority === "Haute"
                            ? "destructive"
                            : project.priority === "Moyenne"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {project.priority}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>Manager: {project.manager}</div>
                      <div>Budget: {project.budget}</div>
                      <div>Statut: {project.status}</div>
                      <div>Échéance: {project.deadline}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          {/* Alertes et Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Alertes & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${
                        alert.type === "error"
                          ? "bg-red-500"
                          : alert.type === "warning"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
