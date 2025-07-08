import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Archive, 
  Eye, 
  MoreHorizontal, 
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  FileText,
  Handshake
} from "lucide-react";
import { Link } from "react-router-dom";
import { getTemplates, getEtapeModeles } from "@/services/templateService";

// Helper functions pour récupérer les noms des templates et étapes
const getTemplateName = (id: string, templates: any[]): string => {
  const template = templates.find((t: any) => t.id === id);
  return template?.description || "Template inconnu";
};

const getEtapeName = (id: string, etapes: any[]): string => {
  const etape = etapes.find((e: any) => e.id === id);
  return etape?.description || "Étape inconnue";
};

// Fonction pour obtenir la couleur du badge de complexité
const getComplexityColor = (niveau: string) => {
  switch (niveau?.toUpperCase()) {
    case "FAIBLE":
      return "bg-green-100 text-green-800";
    case "MOYEN":
      return "bg-yellow-100 text-yellow-800";
    case "ÉLEVÉ":
    case "ELEVE":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

type ProjectTableProps = {
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

export const ProjectTable = ({
  projets,
  type_projet,
  statut_projet,
  loading,
  refreshKey,
  setCurrentProject,
  setOpenDeleteDialog,
  searchTerm,
  filters,
}: ProjectTableProps) => {
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [etapes, setEtapes] = useState<any[]>([]);

  // Charger les templates et étapes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesData, etapesData] = await Promise.all([
          getTemplates(),
          getEtapeModeles()
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

      // Filtre par type (si applicable)
      const matchesType = filters.type === "all" || true; // Temporairement désactivé

      // Filtre par statut (si applicable)
      const matchesStatus = filters.status === "all" || true; // Temporairement désactivé

      // Filtre par complexité
      const matchesComplexity =
        filters.complexity === "all" ||
        project.niveauComplexite === filters.complexity;

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Étape</TableHead>
            <TableHead>Date Début</TableHead>
            <TableHead>Date Fin</TableHead>
            <TableHead>Date Cible</TableHead>
            <TableHead>Progression</TableHead>
            <TableHead>Complexité</TableHead>
            <TableHead>Documentation</TableHead>
            <TableHead>Passation</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-mono text-sm">
                {project.id}
              </TableCell>
              <TableCell className="font-medium">
                <Link
                  to={`/projects/${project.id}`}
                  className="hover:underline"
                >
                  {project.titre}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {getTemplateName(project.modeleProjetId, templates)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  {getEtapeName(project.etapeModeleId, etapes)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(project.dateDebut)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(project.dateFin)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  <Target className="h-3 w-3 mr-1" />
                  {formatDate(project.dateCible)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={project.progressionPct}
                    className="h-2 w-20"
                  />
                  <span className="text-sm">{project.progressionPct}%</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={getComplexityColor(project.niveauComplexite)}
                >
                  {project.niveauComplexite}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={project.documentationDeposeeYn 
                    ? "bg-green-50 text-green-700" 
                    : "bg-gray-50 text-gray-700"
                  }
                >
                  {project.documentationDeposeeYn ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Oui
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Non
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={project.passationTermineeYn 
                    ? "bg-green-50 text-green-700" 
                    : "bg-gray-50 text-gray-700"
                  }
                >
                  {project.passationTermineeYn ? (
                    <>
                      <Handshake className="h-3 w-3 mr-1" />
                      Oui
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Non
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
