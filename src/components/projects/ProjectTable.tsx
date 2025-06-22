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
import { Archive, Eye, MoreHorizontal, Star } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

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
    <div className="flex items-center">
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Progression</TableHead>
            <TableHead>Complexité</TableHead>
            <TableHead>Date fin</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                <Link
                  to={`/projects/${project.id}`}
                  className="hover:underline"
                >
                  {project.titre}
                </Link>
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {project.description}
                </div>
              </TableCell>
              <TableCell>{project.code}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-inwi-tertiary/20 text-inwi-dark-purple">
                  {getStatusName(project.fk_statut_projet_id, statut_projet)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-400/20 text-blue-900">
                  {getTypeName(project.fk_type_projet_id, type_projet)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={project.progression_pct}
                    className="h-2 w-20 "
                  />
                  <span className="text-sm">{project.progression_pct}%</span>
                </div>
              </TableCell>
              <TableCell>
                <RenderComplexite value={project.niveau_complexite} />
              </TableCell>
              <TableCell>
                {new Date(project.date_fin).toLocaleDateString("fr-FR")}
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
