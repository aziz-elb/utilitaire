import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Columns3, Flame, List, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProjectCards } from "@/components/projects/ProjectCards";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { ProjectDialogs } from "@/components/projects/ProjectDialogs";
import ProjectFilters from "@/components/projects/ProjectFilters";
import axios from "axios";
import ProjectConfig from "@/components/projects/ProjectConfig";

export default function Projects() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [Projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeProjet, settypeProjet] = useState([]);
  const [statutProjet, setstatutProjet] = useState([]);
  const [estVisible, setestVisible] = useState(true);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [complexityFilter, setComplexityFilter] = useState("all");
  const [progressFilter, setProgressFilter] = useState("all");
  const [passationFilter, setPassationFilter] = useState("all");

  // Calcul du nombre de filtres actifs
  const activeFiltersCount = [
    typeFilter !== "all",
    statusFilter !== "all",
    complexityFilter !== "all",
    progressFilter !== "all",
    passationFilter !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setComplexityFilter("all");
    setProgressFilter("all");
    setPassationFilter("all");
  };

  const refreshProjects = async () => {
    setRefreshKey((prev) => prev + 1);
  };

  // const handleSearch = (term: string) => {
  //   setSearchTerm(term);
  // };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res_projet = await axios.get("http://localhost:8000/projet");
        setProjects(res_projet.data);
        const res_type_projet = await axios.get(
          "http://localhost:8000/type_projet"
        );
        settypeProjet(res_type_projet.data);
        const res_statut_projet = await axios.get(
          "http://localhost:8000/statut_projet"
        );
        setstatutProjet(res_statut_projet.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [refreshKey]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Projets</h1>
          <p className="text-muted-foreground">
            Gérez et suivez tous vos projets au même endroit
          </p>
        </div>
        <Button onClick={() => setOpenAddDialog(true)} className="bg-inwi-purple/80 hover:bg-inwi-purple">
          <Plus className="mr-2 h-4 w-4 " /> Nouveau Projet
        </Button>
      </div>

      {/* Composant de filtres */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">

      <ProjectFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        complexityFilter={complexityFilter}
        onComplexityFilterChange={setComplexityFilter}
        progressFilter={progressFilter}
        onProgressFilterChange={setProgressFilter}
        passationFilter={passationFilter}
        onPassationFilterChange={setPassationFilter}
        onClearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
      />
      </div>


<div className="bg-white mt-3 rounded-lg shadow p-6 pt-2 space-y-4">

      <Tabs
        defaultValue="table"
        onValueChange={(value) => setViewMode(value as "table" | "cards")}
      >
        <TabsList className="mx-4 ">
          <TabsTrigger value="table">
            <List className="h-4 w-4 mr-2" /> Tableau
          </TabsTrigger>
          <TabsTrigger value="cards">
            <Columns3 className="h-4 w-4 mr-2" /> Cartes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <ProjectTable
            projets={Projects}
            type_projet={typeProjet}
            statut_projet={statutProjet}
            loading={loading}
            refreshKey={refreshKey}
            setCurrentProject={setCurrentProject}
            setOpenDeleteDialog={setOpenDeleteDialog}
            searchTerm={searchTerm}
            filters={{
              type: typeFilter,
              status: statusFilter,
              complexity: complexityFilter,
              progress: progressFilter,
              passation: passationFilter,
            }}
          />
        </TabsContent>

        <TabsContent value="cards">
          <ProjectCards
            projets={Projects}
            type_projet={typeProjet}
            statut_projet={statutProjet}
            loading={loading}
            refreshKey={refreshKey}
            setCurrentProject={setCurrentProject}
            setOpenDeleteDialog={setOpenDeleteDialog}
            searchTerm={searchTerm}
            filters={{
              type: typeFilter,
              status: statusFilter,
              complexity: complexityFilter,
              progress: progressFilter,
              passation: passationFilter,
            }}
          />
        </TabsContent>
      </Tabs>
</div>


      {/* // Second part Dedie a la Configuratin De Projet */}
<div className="bg-white mt-3 rounded-lg shadow p-6 space-y-4">

      <ProjectConfig />

</div>
      <ProjectDialogs
        openAddDialog={openAddDialog}
        setOpenAddDialog={setOpenAddDialog}
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        currentProject={currentProject}
        setCurrentProject={setCurrentProject}
        refreshProjects={refreshProjects}
      />
    </div>
  );
}
