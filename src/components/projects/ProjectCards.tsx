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
import { Archive, Eye, MoreHorizontal, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "@/pages/Loading";

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "En attente":
//       return "secondary";
//     case "En cours":
//       return "default";
//     case "Terminé":
//       return "success";
//     default:
//       return "outline";
//   }
// };

const RenderComplexite = ({ value }: { value: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < value ? "fill-current text-amber-500" : "fill-current text-gray-200"}
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

  // Dans ProjectTable.tsx
  useEffect(() => {
    const filtered = projets.filter((project) => {
      // Filtre de recherche
      const matchesSearch = searchTerm
        ? project.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.code.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      // Filtre par type
      const matchesType =
        filters.type === "all" || project.fk_type_projet_id === filters.type;

      // Filtre par statut
      const matchesStatus =
        filters.status === "all" ||
        project.fk_statut_projet_id === filters.status;

      // Filtre par complexité
      const matchesComplexity =
        filters.complexity === "all" ||
        project.niveau_complexite === parseInt(filters.complexity);

      // Filtre par progression
      let matchesProgress = true;
      if (filters.progress !== "all") {
        const [min, max] = filters.progress.split("-").map(Number);
        matchesProgress =
          project.progression_pct >= min && project.progression_pct <= max;
      }

      // Filtre par passation
      let matchesPassation = true;
      if (filters.passation !== "all") {
        matchesPassation =
          project.passation_terminee_yn === (filters.passation === "true");
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

  // Helper functions avec typage correct
  const getTypeName = (id: string, type_projet: any[]): string => {
    const type = type_projet.find((t: any) => t.id === id);
    return type?.libelle || "Inconnu";
  };

  const getStatusName = (id: string, statut_projet: any[]): string => {
    const status = statut_projet.find((s: any) => s.id === id);
    return status?.libelle || "Inconnu";
  };


  if (loading) return <div>Loading ...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredProjects.map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  <Link
                    to={`/projects/${project.id}`}
                    className="hover:underline"
                  >
                    {project.titre}
                  </Link>
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="bg-inwi-tertiary/20 text-inwi-dark-purple">
                    {getStatusName(project.fk_statut_projet_id, statut_projet)}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-400/20 text-blue-800">
                    {getTypeName(project.fk_type_projet_id, type_projet)}
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
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {project.description}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span className="font-medium">{project.progression_pct}%</span>
              </div>
              <Progress value={project.progression_pct} className="h-2" />
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm">
                <div>Complexité</div>
                <RenderComplexite value={project.niveau_complexite} />
              </div>

              <div className="text-sm text-right">
                <div>Date fin</div>
                <div className="font-medium">
                  {new Date(project.date_fin).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <span>{project.code}</span>
            <span>
              Créé le{" "}
              {new Date(project.date_creation).toLocaleDateString("fr-FR")}
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
