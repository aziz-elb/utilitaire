import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  Edit,
  Archive,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  FileText,
  Handshake,
  XCircle,
  Plus,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  getProjectById,
  updateProject,
  type Project,
  updateProjectPartial,
} from "@/services/projectService";
import { getTemplates, getEtapeModeles } from "@/services/templateService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CommentairesSection } from "@/components/projects/CommentairesSection";
import { MembreSection } from "@/components/projects/MembreSection";
import { ActiviteTab } from "@/components/projects/ActiviteTab";
import { EtapesProjetTab } from "@/components/projects/EtapesProjetTab";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [etapes, setEtapes] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    modeleProjetId: "",
    etapeModeleId: "",
    dateDebut: "",
    dateFin: "",
    dateCible: "",
    progressionPct: 0,
    niveauComplexite: "MOYEN",
    documentationDeposeeYn: false,
    passationTermineeYn: false,
  });

  // Charger les données du projet et des références
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const [projectData, templatesData, etapesData] = await Promise.all([
          getProjectById(id),
          getTemplates(),
          getEtapeModeles(),
        ]);

        setProject(projectData);
        setTemplates(templatesData);
        setEtapes(etapesData);

        setFormData({
          titre: projectData.titre || "",
          description: projectData.description || "",
          modeleProjetId: projectData.modeleProjetId || "",
          etapeModeleId: projectData.etapeModeleId || "",
          dateDebut: projectData.dateDebut || "",
          dateFin: projectData.dateFin || "",
          dateCible: projectData.dateCible || "",
          progressionPct: projectData.progressionPct || 0,
          niveauComplexite: projectData.niveauComplexite || "MOYEN",
          documentationDeposeeYn: projectData.documentationDeposeeYn || false,
          passationTermineeYn: projectData.passationTermineeYn || false,
        });
      } catch (error) {
        console.error("Erreur lors du chargement du projet:", error);
        toast.error("Erreur lors du chargement du projet");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Fonction pour mettre à jour le projet (PATCH)
  const handleUpdateProject = async () => {
    if (!id) return;
    // Only send changed fields (partial update)
    const changedFields: any = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof typeof formData] !== (project as any)[key]) {
        changedFields[key] = formData[key as keyof typeof formData];
      }
    });
    if (Object.keys(changedFields).length === 0) {
      setOpenEditDialog(false);
      return;
    }
    try {
      const updatedProject = await updateProjectPartial(id, changedFields);
      setProject(updatedProject);
      setOpenEditDialog(false);
      toast.success("Projet mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du projet");
    }
  };

  // Helper functions
  const getTemplateName = (id: string): string => {
    const template = templates.find((t: any) => t.id === id);
    return template?.description || "Template inconnu";
  };

  const getEtapeName = (id: string): string => {
    const etape = etapes.find((e: any) => e.id === id);
    return etape?.description || "Étape inconnue";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Chargement...</div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        Projet non trouvé
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {project.titre}
              </h1>
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground"
              >
                ID: {project.id}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {project.description}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="default"
              size="lg"
            >
              <Link
                to="/projects"
                className="flex flex-row items-center justify-center gap-3"
              >
                <ChevronLeft />
                Retour
              </Link>
            </Button>
            <Button variant="outline"  size="lg" onClick={() => setOpenEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </div>
        </div>

        {/* Template et Étape */}
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Template: {getTemplateName(project.modeleProjetId)}
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Étape: {getEtapeName(project.etapeModeleId)}
          </Badge>
        </div>
      </div>

      {/* Project Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progressionPct}%</div>
            <Progress value={project.progressionPct} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Début
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {formatDate(project.dateDebut)}
            </div>
            <p className="text-xs text-muted-foreground">Début du projet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Fin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {formatDate(project.dateFin)}
            </div>
            <p className="text-xs text-muted-foreground">Fin prévue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Date Cible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {formatDate(project.dateCible)}
            </div>
            <p className="text-xs text-muted-foreground">Objectif</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Complexité</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant="outline"
              className={getComplexityColor(project.niveauComplexite)}
            >
              {project.niveauComplexite}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {project.documentationDeposeeYn ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Déposée</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium">Non déposée</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Handshake className="h-4 w-4" />
              Passation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {project.passationTermineeYn ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Terminée</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium">En cours</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="membres">Membres</TabsTrigger>
          <TabsTrigger value="commentaires">Commentaires</TabsTrigger>
          <TabsTrigger value="etapes">Étapes</TabsTrigger>
          {/* <TabsTrigger value="files">Fichiers</TabsTrigger> */}
          <TabsTrigger value="activites">Activités</TabsTrigger>
        </TabsList>

        <TabsContent value="etapes" className="space-y-4">
          <EtapesProjetTab projetId={id || ""} />
        </TabsContent>

        <TabsContent value="commentaires" className="space-y-4">
          <CommentairesSection projetId={id || ""} />
        </TabsContent>

        {/* <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fichiers du projet</CardTitle>
              <CardDescription>Documents et ressources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Documents du projet</h4>
                  <Button size="sm" className="bg-inwi-purple/80 hover:bg-inwi-purple">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un fichier
                  </Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Spécifications.pdf</div>
                        <div className="text-xs text-muted-foreground">2.3 MB • Il y a 3 jours</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Planning.xlsx</div>
                        <div className="text-xs text-muted-foreground">1.1 MB • Il y a 1 semaine</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-purple-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Rapport.docx</div>
                        <div className="text-xs text-muted-foreground">856 KB • Il y a 2 semaines</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center py-4 text-muted-foreground">
                  <p>Gestion avancée des fichiers en cours de développement...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="activites" className="space-y-4">
          <ActiviteTab projetId={id || ""} />
        </TabsContent>

        <TabsContent value="membres" className="space-y-4">
          <MembreSection projetId={id || ""} />
        </TabsContent>
      </Tabs>

      {/* Dialogue d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Modifier le Projet</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) =>
                    setFormData({ ...formData, titre: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="niveauComplexite">Complexité</Label>
                <Select
                  value={formData.niveauComplexite}
                  onValueChange={(value) =>
                    setFormData({ ...formData, niveauComplexite: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la complexité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FAIBLE">Faible</SelectItem>
                    <SelectItem value="MOYEN">Moyen</SelectItem>
                    <SelectItem value="ÉLEVÉ">Élevé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Date de début */}
              <div className="space-y-2">
                <Label htmlFor="dateDebut">Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateDebut && "text-muted-foreground"
                      )}
                    >
                      {formData.dateDebut
                        ? new Date(formData.dateDebut).toLocaleDateString(
                            "fr-FR"
                          )
                        : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ShadcnCalendar
                      mode="single"
                      selected={
                        formData.dateDebut
                          ? new Date(formData.dateDebut)
                          : undefined
                      }
                      onSelect={(date) => {
                        setFormData({
                          ...formData,
                          dateDebut: date
                            ? date.toISOString().slice(0, 10)
                            : "",
                        });
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* Date de fin */}
              <div className="space-y-2">
                <Label htmlFor="dateFin">Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateFin && "text-muted-foreground"
                      )}
                    >
                      {formData.dateFin
                        ? new Date(formData.dateFin).toLocaleDateString("fr-FR")
                        : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ShadcnCalendar
                      mode="single"
                      selected={
                        formData.dateFin
                          ? new Date(formData.dateFin)
                          : undefined
                      }
                      onSelect={(date) => {
                        setFormData({
                          ...formData,
                          dateFin: date ? date.toISOString().slice(0, 10) : "",
                        });
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* Date cible */}
              <div className="space-y-2">
                <Label htmlFor="dateCible">Date cible</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateCible && "text-muted-foreground"
                      )}
                    >
                      {formData.dateCible
                        ? new Date(formData.dateCible).toLocaleDateString(
                            "fr-FR"
                          )
                        : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ShadcnCalendar
                      mode="single"
                      selected={
                        formData.dateCible
                          ? new Date(formData.dateCible)
                          : undefined
                      }
                      onSelect={(date) => {
                        setFormData({
                          ...formData,
                          dateCible: date
                            ? date.toISOString().slice(0, 10)
                            : "",
                        });
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modeleProjetId">Template</Label>
                <Select
                  value={formData.modeleProjetId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, modeleProjetId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="etapeModeleId">Étape</Label>
                <Select
                  value={formData.etapeModeleId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, etapeModeleId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une étape" />
                  </SelectTrigger>
                  <SelectContent>
                    {etapes.map((etape) => (
                      <SelectItem key={etape.id} value={etape.id}>
                        {etape.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="space-y-2">
              <Label htmlFor="progression">
                Progression ({formData.progressionPct}%)
              </Label>
              <Input
                type="range"
                id="progression"
                min="0"
                max="100"
                value={formData.progressionPct}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    progressionPct: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>

            {/* Switches pour documentation et passation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="documentation"
                  checked={formData.documentationDeposeeYn}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      documentationDeposeeYn: checked,
                    })
                  }
                />
                <Label htmlFor="documentation">Documentation déposée</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="passation"
                  checked={formData.passationTermineeYn}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, passationTermineeYn: checked })
                  }
                />
                <Label htmlFor="passation">Passation terminée</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleUpdateProject}
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectView;
