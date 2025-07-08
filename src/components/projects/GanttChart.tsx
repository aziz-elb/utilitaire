import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEtapesProjet, type EtapeProjet } from "@/services/etapeProjetService";
import { getStatutEtapes } from "@/services/statutEtapeService";
import { getTypeEtapes } from "@/services/typeEtapeService";
import { toast } from "sonner";

interface GanttChartProps {
  projetId: string;
  dateDebutProjet: string;
  dateFinProjet: string;
}

interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  type: string;
  statut: string;
  priorite: string;
}

export const GanttChart = ({ projetId, dateDebutProjet, dateFinProjet }: GanttChartProps) => {
  const [etapes, setEtapes] = useState<EtapeProjet[]>([]);
  const [statuts, setStatuts] = useState<any[]>([]);
  const [typesEtape, setTypesEtape] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les étapes du projet
  const loadEtapes = async () => {
    if (!projetId) return;
    
    try {
      setLoading(true);
      const etapesData = await getEtapesProjet(projetId);
      setEtapes(etapesData.sort((a, b) => a.ordre - b.ordre));
    } catch (error: any) {
      console.log("Erreur lors du chargement des étapes:", error.message);
      // Données de démonstration si aucune étape n'existe
      setEtapes([
        {
          id: 'demo-1',
          projetId: projetId,
          titre: 'Phase de Planification',
          description: 'Définition des objectifs et planning initial',
          progressionPct: 75,
          ordre: 1,
          priorite: 'HAUTE' as const,
          dateDebut: dateDebutProjet,
          dateFin: new Date(new Date(dateDebutProjet).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          statutId: 'statut-1',
          typeEtapeId: 'type-1'
        },
        {
          id: 'demo-2',
          projetId: projetId,
          titre: 'Phase de Développement',
          description: 'Implémentation des fonctionnalités',
          progressionPct: 45,
          ordre: 2,
          priorite: 'MOYEN' as const,
          dateDebut: new Date(new Date(dateDebutProjet).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dateFin: new Date(new Date(dateDebutProjet).getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          statutId: 'statut-2',
          typeEtapeId: 'type-2'
        },
        {
          id: 'demo-3',
          projetId: projetId,
          titre: 'Phase de Tests',
          description: 'Validation et tests finaux',
          progressionPct: 10,
          ordre: 3,
          priorite: 'BAS' as const,
          dateDebut: new Date(new Date(dateDebutProjet).getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dateFin: dateFinProjet,
          statutId: 'statut-3',
          typeEtapeId: 'type-3'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données de référence
  const loadReferenceData = async () => {
    try {
      const [statutsData, typesData] = await Promise.all([
        getStatutEtapes(),
        getTypeEtapes()
      ]);
      setStatuts(statutsData);
      setTypesEtape(typesData);
    } catch (error: any) {
      console.log("Erreur lors du chargement des données de référence:", error.message);
      // Données de démonstration pour les références
      setStatuts([
        { id: 'statut-1', description: 'En cours' },
        { id: 'statut-2', description: 'En attente' },
        { id: 'statut-3', description: 'Terminé' }
      ]);
      setTypesEtape([
        { id: 'type-1', description: 'Planification' },
        { id: 'type-2', description: 'Développement' },
        { id: 'type-3', description: 'Test' }
      ]);
    }
  };

  useEffect(() => {
    loadEtapes();
    loadReferenceData();
  }, [projetId]);

  // Fonction pour obtenir le nom du statut
  const getStatutNom = (statutId: string) => {
    const statut = statuts.find(s => s.id === statutId);
    return statut ? statut.description : 'Statut inconnu';
  };

  // Fonction pour obtenir le nom du type d'étape
  const getTypeEtapeNom = (typeId: string) => {
    const type = typesEtape.find(t => t.id === typeId);
    return type ? type.description : 'Type inconnu';
  };

  // Convertir les étapes en format Gantt
  const ganttTasks: GanttTask[] = useMemo(() => {
    return etapes.map(etape => ({
      id: etape.id,
      name: etape.titre,
      start: new Date(etape.dateDebut),
      end: new Date(etape.dateFin),
      progress: etape.progressionPct,
      type: getTypeEtapeNom(etape.typeEtapeId),
      statut: getStatutNom(etape.statutId),
      priorite: etape.priorite,
    }));
  }, [etapes, statuts, typesEtape]);

  // Fonction pour obtenir la couleur selon la priorité
  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'HAUTE': return 'bg-red-500';
      case 'MOYEN': return 'bg-orange-500';
      case 'BAS': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Générer les colonnes de dates (semaines)
  const generateDateColumns = () => {
    const startDate = new Date(dateDebutProjet);
    const endDate = new Date(dateFinProjet);
    const columns = [];
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      columns.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7); // Ajouter une semaine
    }
    
    return columns;
  };

  // Vérifier si une tâche est active à une date donnée
  const isTaskActiveOnDate = (task: GanttTask, date: Date) => {
    return task.start <= date && task.end >= date;
  };

  const dateColumns = generateDateColumns();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <p>Chargement du planning du projet...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (etapes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucune étape définie pour ce projet.</p>
            <p className="text-sm">Ajoutez des étapes pour voir le planning visuel.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">Planning du Projet</CardTitle>
            <p className="text-sm text-gray-600">
              Du {formatDate(new Date(dateDebutProjet))} au {formatDate(new Date(dateFinProjet))}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700 min-w-[200px]">
                  Étapes
                </th>
                {dateColumns.map((date, index) => (
                  <th key={index} className="border border-gray-300 p-2 text-center text-xs font-medium text-gray-600 min-w-[80px]">
                    {formatDate(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ganttTasks.map((task, taskIndex) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3 bg-white">
                    <div className="space-y-1">
                      <div className="font-medium text-sm text-gray-800">{task.name}</div>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {task.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {task.statut}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {task.progress}% terminé
                      </div>
                    </div>
                  </td>
                  {dateColumns.map((date, dateIndex) => {
                    const isActive = isTaskActiveOnDate(task, date);
                    return (
                      <td key={dateIndex} className="border border-gray-300 p-1 text-center">
                        {isActive && (
                          <div 
                            className={`w-full h-8 rounded ${getPrioriteColor(task.priorite)} flex items-center justify-center text-white text-xs font-medium`}
                            title={`${task.name} - ${task.progress}%`}
                          >
                            {task.progress}%
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Légende */}
        <div className="p-4 bg-gray-50 border-t">
          <h4 className="font-medium text-sm mb-3">Légende</h4>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Priorité Haute</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>Priorité Moyenne</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Priorité Basse</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 