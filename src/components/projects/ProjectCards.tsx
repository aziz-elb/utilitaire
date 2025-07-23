import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Archive, 
  Eye, 
  MoreHorizontal, 
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  Handshake,
  Star
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { getTemplates, getEtapeTemplates } from "@/services/templateService";

// Helper functions pour récupérer les noms des templates et étapes
const getTemplateName = (id: string, templates: any[]): string => {
  const template = templates.find((t: any) => t.id === id);
  return template?.libelle || "Template inconnu";
};

const getEtapeName = (id: string, etapes: any[]): string => {
  const etape = etapes.find((e: any) => e.id === id);
  return etape?.libelle || "Étape inconnue";
};

// Fonction pour obtenir la couleur du badge de complexité

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

const renderStars = (count: number) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < count
              ? "fill-current text-amber-500 "
              : "fill-current text-gray-200 "
          }
        />
      ))}
    </div>
  );
};

type ProjectCardsProps = {
  projets: any[];
  type_projet: any[];
  statut_projet: any[];
  loading: boolean;
  refreshKey: number;
  setCurrentProject: (project: any) => void;
  setOpenDeleteDialog: (open: boolean) => void;
  searchTerm: string;
  filters: any;
};

export const ProjectCards = ({
  projets,
  type_projet,
  statut_projet,
  loading,
  refreshKey,
  setCurrentProject,
  setOpenDeleteDialog,
  searchTerm,
  filters,
}: ProjectCardsProps) => {
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [etapes, setEtapes] = useState<any[]>([]);

  // Charger les templates et étapes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesData, etapesData] = await Promise.all([
          getTemplates(),
          getEtapeTemplates()
        ]);
        setTemplates(templatesData);
        setEtapes(etapesData);
      } catch (error) {
        console.error("Erreur lors du chargement des templates/étapes:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = projets.filter((project) => {
      // Filtre de recherche
      const matchesSearch = searchTerm
        ? project.titre.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

        const matchesType = filters.type === "all" || project.typeProjetId === filters.type; // Temporairement désactivé

        // Filtre par statut (si applicable)
        const matchesStatus = filters.status === "all" || project.statutProjetId === filters.status; // Temporairement désactivé
  
        // Filtre par complexité
        const matchesComplexity =
          filters.complexity === "all" ||
          project.niveauComplexite == filters.complexity;
  
  
        // Filtre par progression
        let matchesProgress = true;
        if (filters.progress !== "all") {
          const [min, max] = filters.progress.split("-").map(Number);
          matchesProgress =
            project.progressionPct >= min && project.progressionPct <= max;
        }
  
        // Filtre par passation
        let matchesPassation = true;
        if (filters.passation !== "all") {
          matchesPassation =
            project.passationTermineeYn === (filters.passation === "true");
        }

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesComplexity &&
        matchesProgress &&
        matchesPassation
      );
    });

    setFilteredProjects(filtered);
  }, [searchTerm, projets, filters]);

  if (loading) return <div>Loading ...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredProjects.map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">
                  <Link
                    to={`/projects/${project.id}`}
                    className="hover:underline"
                  >
                    {project.titre}
                  </Link>
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                  {project.typeProjetLibelle}
                    
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                  {project.statutProjetLibelle}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    <Link to={`/projects/${project.id}`}>Voir détails</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      setCurrentProject(project);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>

            {/* Progression */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span className="font-medium">{project.progressionPct}%</span>
              </div>
              <Progress value={project.progressionPct} className="h-2" />
            </div>

            {/* Complexité */}
            <div className="flex justify-between items-center">
              <span className="text-sm">Complexité</span>
              {renderStars(project.niveauComplexite)}
            
              
            </div>

            {/* Dates avec badges et icônes */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(project.dateDebut)}
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(project.dateFin)}
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">
                <Target className="h-3 w-3 mr-1" />
                {formatDate(project.dateCible)}
              </Badge>
            </div>

            {/* Documentation et Passation */}
            <div className="flex justify-between items-center pt-2 border-t">
              <div className="flex items-center gap-2">
                {project.documentationDeposeeYn ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-xs text-muted-foreground">Documentation</span>
              </div>
              <div className="flex items-center gap-2">
                {project.passationTermineeYn ? (
                  <Handshake className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-xs text-muted-foreground">Passation</span>
              </div>
            </div>
          </CardContent>
          
        
        </Card>
      ))}
    </div>
  );
};
