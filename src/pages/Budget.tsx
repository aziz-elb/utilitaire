
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Budget: React.FC = () => {
  const budgetData = {
    total: {
      allocated: 5200000,
      spent: 3850000,
      remaining: 1350000,
      percentage: 74
    },
    byCategory: [
      {
        name: 'Infrastructure',
        allocated: 2100000,
        spent: 1680000,
        percentage: 80,
        projects: 3,
        status: 'warning'
      },
      {
        name: 'Digital & IoT',
        allocated: 1500000,
        spent: 950000,
        percentage: 63,
        projects: 2,
        status: 'good'
      },
      {
        name: 'Sécurité',
        allocated: 950000,
        spent: 760000,
        percentage: 80,
        projects: 2,
        status: 'warning'
      },
      {
        name: 'Business Apps',
        allocated: 650000,
        spent: 460000,
        percentage: 71,
        projects: 1,
        status: 'good'
      }
    ],
    kpis: [
      {
        name: 'ROI Moyen',
        value: '23%',
        target: '20%',
        trend: 'up',
        status: 'good'
      },
      {
        name: 'Time to Market',
        value: '8.2 mois',
        target: '9 mois',
        trend: 'up',
        status: 'good'
      },
      {
        name: 'Dépassement Budget',
        value: '12%',
        target: '< 10%',
        trend: 'down',
        status: 'warning'
      },
      {
        name: 'Projets à l\'heure',
        value: '76%',
        target: '85%',
        trend: 'down',
        status: 'warning'
      }
    ],
    monthlySpending: [
      { month: 'Jan', opex: 180000, capex: 320000 },
      { month: 'Fév', opex: 195000, capex: 280000 },
      { month: 'Mar', opex: 210000, capex: 350000 },
      { month: 'Avr', opex: 188000, capex: 290000 },
      { month: 'Mai', opex: 205000, capex: 410000 },
      { month: 'Jun', opex: 220000, capex: 380000 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'danger': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget & Indicateurs</h1>
          <p className="text-gray-600">Suivi financier et KPIs de performance des projets</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          <BarChart3 className="h-4 w-4 mr-2" />
          Générer Rapport
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(budgetData.total.allocated)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consommé</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(budgetData.total.spent)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <div className="text-sm text-gray-600">{budgetData.total.percentage}% du budget</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Restant</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(budgetData.total.remaining)}
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progression</p>
                <p className="text-2xl font-bold text-gray-900">{budgetData.total.percentage}%</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <Progress value={budgetData.total.percentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="budget" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="budget">Répartition Budget</TabsTrigger>
          <TabsTrigger value="kpis">Indicateurs KPIs</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        <TabsContent value="budget" className="space-y-6">
          {/* Budget by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgetData.byCategory.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <Badge variant="outline">{category.projects} projets</Badge>
                        <Badge className={getStatusColor(category.status)}>
                          {category.status === 'good' ? 'Conforme' : 'Attention'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(category.spent)} / {formatCurrency(category.allocated)}
                        </div>
                        <div className="text-sm text-gray-600">{category.percentage}%</div>
                      </div>
                    </div>
                    <Progress 
                      value={category.percentage} 
                      className={`h-2 ${category.percentage > 85 ? '[&>div]:bg-red-500' : category.percentage > 75 ? '[&>div]:bg-orange-500' : '[&>div]:bg-green-500'}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kpis" className="space-y-6">
          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetData.kpis.map((kpi, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">{kpi.name}</h3>
                    {kpi.trend === 'up' ? (
                      <TrendingUp className={`h-4 w-4 ${kpi.status === 'good' ? 'text-green-500' : 'text-red-500'}`} />
                    ) : (
                      <TrendingDown className={`h-4 w-4 ${kpi.status === 'good' ? 'text-green-500' : 'text-red-500'}`} />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                  <div className="text-sm text-gray-600">
                    Objectif: {kpi.target}
                  </div>
                  <Badge className={`mt-2 ${getStatusColor(kpi.status)}`}>
                    {kpi.status === 'good' ? 'Objectif atteint' : 'À améliorer'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Alertes Budgétaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Budget Infrastructure : 80% consommé
                    </p>
                    <p className="text-xs text-gray-600">
                      Risque de dépassement sur Q3 si tendance maintenue
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Projet "Migration 5G" : +15% vs budget initial
                    </p>
                    <p className="text-xs text-gray-600">
                      Validation budgétaire requise pour la phase 3
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Monthly Spending Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle OPEX vs CAPEX</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetData.monthlySpending.map((month, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center py-2">
                    <div className="font-medium text-gray-900">{month.month}</div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">OPEX</div>
                      <div className="text-sm font-medium">{formatCurrency(month.opex)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">CAPEX</div>
                      <div className="text-sm font-medium">{formatCurrency(month.capex)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(month.opex + month.capex)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>Prévisions Budgétaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">Q3 2024</div>
                  <div className="text-sm text-gray-600 mt-1">Prévision</div>
                  <div className="text-lg font-medium text-gray-900 mt-2">1.8M MAD</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">Q4 2024</div>
                  <div className="text-sm text-gray-600 mt-1">Prévision</div>
                  <div className="text-lg font-medium text-gray-900 mt-2">2.1M MAD</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">2025</div>
                  <div className="text-sm text-gray-600 mt-1">Budget prévisionnel</div>
                  <div className="text-lg font-medium text-gray-900 mt-2">6.5M MAD</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Budget;
