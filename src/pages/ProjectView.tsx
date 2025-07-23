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
  CalendarIcon,
  BarChart,
  CalendarCheck2,
  Layers,
  BadgeCheck,
  Activity,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  getProjectById,
  updateProject,
  type Project,
} from "@/services/projectService";
import { getTemplates, getEtapeTemplates } from "@/services/templateService";
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
import { EtapesProjetTab } from "@/components/projects/EtapesProjetTab";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getTypeProjets } from "@/services/typeProjetService";
import { getStatutProjets } from "@/services/statutProjetService";
import type { TypeProjet } from "@/services/typeProjetService";
import type { StatutProjet } from "@/services/statutProjetService";

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Fonction pour convertir la complexité en nombre
// const getComplexityNumber = (complexity: string): number => {
//   switch (complexity) {
//     case "FAIBLE": return 1;
//     case "MOYEN": return 3;
//     case "ÉLEVÉ": return 5;
//     default: return 3;
//   }
// };

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [etapes, setEtapes] = useState<any[]>([]);
  const [typeProjets, setTypeProjets] = useState<TypeProjet[]>([]);
  const [statutProjets, setStatutProjets] = useState<StatutProjet[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    code: "",
    description: "",
    typeProjetId: "",
    templateProjetId: "",
    statutProjetId: "",
    dateDebut: "",
    dateFin: "",
    dateCible: "",
    progressionPct: 0,
    niveauComplexite: 3,
    documentationDeposeeYn: false,
    passationTermineeYn: false,
    visibiliteYn: false,
  });

  // États pour les dates
  const [dateDebut, setDateDebut] = useState<Date | undefined>(undefined);
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined);
  const [dateCible, setDateCible] = useState<Date | undefined>(undefined);

  // Charger les données du projet et des références
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        if (!id) return;
        
        const [projectData, templatesData, etapesData, typeProjetsData, statutProjetsData] = await Promise.all([
          getProjectById(id),
          getTemplates(),
          getEtapeTemplates(id),
          getTypeProjets(),
          getStatutProjets(),
        ]);

        setProject(projectData);
        setTemplates(templatesData);
        setEtapes(etapesData);
        setTypeProjets(typeProjetsData);
        setStatutProjets(statutProjetsData);

        // Convertir la complexité en nombre
        // const complexityNumber = getComplexityNumber(String(projectData.niveauComplexite || "MOYEN"));

        setFormData({
          titre: projectData.titre || "",
          code: projectData.code || "",
          description: projectData.description || "",
          typeProjetId: projectData.typeProjetId || "",
          templateProjetId: projectData.templateProjetId || "",
          statutProjetId: projectData.statutProjetId || "",
          dateDebut: projectData.dateDebut || "",
          dateFin: projectData.dateFin || "",
          dateCible: projectData.dateCible || "",
          progressionPct: projectData.progressionPct || 0,
          niveauComplexite: projectData.niveauComplexite || 0,
          documentationDeposeeYn: projectData.documentationDeposeeYn || false,
          passationTermineeYn: projectData.passationTermineeYn || false,
          visibiliteYn: projectData.visibiliteYn || false,
        });

        // Initialiser les dates
        setDateDebut(projectData.dateDebut ? new Date(projectData.dateDebut) : undefined);
        setDateFin(projectData.dateFin ? new Date(projectData.dateFin) : undefined);
        setDateCible(projectData.dateCible ? new Date(projectData.dateCible) : undefined);
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

    try {
      const updatedProject = await updateProject(id, formData);
      setProject(updatedProject);
      setOpenEditDialog(false);
      toast.success("Projet mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du projet");
    }
  };

  // Fonctions pour gérer les changements de dates
  const handleDateDebutChange = (date: Date | undefined) => {
    setDateDebut(date);
    setFormData({ 
      ...formData, 
      dateDebut: date ? format(date, 'yyyy-MM-dd') : "" 
    });
  };

  const handleDateFinChange = (date: Date | undefined) => {
    setDateFin(date);
    setFormData({ 
      ...formData, 
      dateFin: date ? format(date, 'yyyy-MM-dd') : "" 
    });
  };

  const handleDateCibleChange = (date: Date | undefined) => {
    setDateCible(date);
    setFormData({ 
      ...formData, 
      dateCible: date ? format(date, 'yyyy-MM-dd') : "" 
    });
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
      {/* Bouton de retour */}
      

      {/* Project Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {project.titre}
              </h1>
              
            </div>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex flex-row gap-2">
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
          <Button 
          variant="default"
          size="lg"
          className="inwi_btn"
          
          onClick={() => setOpenEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          </div>
          
        </div>

      
      </div>

      {/* Project Stats */}
      <div className="grid gap-4 grid-cols-5 ">
    

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Type Projet</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
          <div className="text-lg font-semibold">{typeProjets.find((type) => type.id === project.typeProjetId)?.libelle}</div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut Projet</CardTitle>
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
          <div className="text-lg font-semibold">{statutProjets.find((statut) => statut.id === project.statutProjetId)?.libelle}</div>
          </CardContent>
        </Card>


        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date de début</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{formatDate(project.dateDebut)}</div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date de fin</CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{formatDate(project.dateFin)}</div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date cible</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{formatDate(project.dateCible)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-4">
      <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
          <div className="text-lg font-semibold text-end">{project.progressionPct}%</div>
          <Progress value={project.progressionPct} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader  className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complexité</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Rating
              value={project.niveauComplexite}
              readOnly
              className="text-yellow-500"
            >
              <RatingButton />
              <RatingButton />
              <RatingButton />
              <RatingButton />
              <RatingButton />
            </Rating>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
           
              Documentation
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
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
          <CardHeader  className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Passation
            </CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />

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
      <Tabs defaultValue="etapes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="etapes">Étapes</TabsTrigger>
          <TabsTrigger value="membres">Membres</TabsTrigger>
          <TabsTrigger value="commentaires">Commentaires</TabsTrigger>
        </TabsList>

        <TabsContent value="etapes" className="space-y-4">
          <EtapesProjetTab projetId={id || ""} />
        </TabsContent>

        <TabsContent value="commentaires" className="space-y-4">
          <CommentairesSection projetId={id || ""} />
        </TabsContent>

        <TabsContent value="membres" className="space-y-4">
          <MembreSection projetId={id || ""} />
        </TabsContent>
      </Tabs>

      {/* Dialogue d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Modifier le Projet</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-6 max-w-3xl py-5 grid grid-cols-4 gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await handleUpdateProject();
              } catch (error) {
                // error handled in handleUpdateProject
              }
            }}
          >
            <div className="space-y-2 col-span-3">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Titre"
                required
              />
            </div>

            <div className="space-y-2 col-span-1">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="PORTAIL-11111"
                required
              />
            </div>
            <div className="col-span-4 grid grid-cols-6 space-x-1">

              <div className="space-y-2 col-span-2">
                <Label htmlFor="typeProjetId">Type Projet *</Label>
                <Select
                  value={formData.typeProjetId}
                  onValueChange={(value) => setFormData({ ...formData, typeProjetId: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un type de projet"} />
                  </SelectTrigger>
                  <SelectContent>
                    {typeProjets.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="statutProjetId">Statut Projet *</Label>
                <Select
                  value={formData.statutProjetId}
                  onValueChange={(value) => setFormData({ ...formData, statutProjetId: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un statut"} />
                  </SelectTrigger>
                  <SelectContent>
                    {statutProjets.map((statut) => (
                      <SelectItem key={statut.id} value={statut.id}>
                        {statut.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="templateProjetId">Template *</Label>
                <Select
                  value={formData.templateProjetId}
                  onValueChange={(value) => setFormData({ ...formData, templateProjetId: value })}
                  disabled={true}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un template"} />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Champs de date avec Calendar */}
            <div className="col-span-4 grid grid-cols-6 space-x-1">
              <div className="space-y-2 col-span-2">
                <Label>Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateDebut ? format(dateDebut, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <ShadcnCalendar
                      mode="single"
                      selected={dateDebut}
                      onSelect={handleDateDebutChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFin ? format(dateFin, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <ShadcnCalendar
                      mode="single"
                      selected={dateFin}
                      onSelect={handleDateFinChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Date cible</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateCible ? format(dateCible, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <ShadcnCalendar
                      mode="single"
                      selected={dateCible}
                      onSelect={handleDateCibleChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Slider de progression */}
            <div className="space-y-2 col-span-4">
              <Label>Progression: {formData.progressionPct}%</Label>
              <Slider
                value={[formData.progressionPct]}
                onValueChange={(value) => setFormData({ ...formData, progressionPct: value[0] })}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Toggles avec Switch */}
            <div className="flex space-x-8 col-span-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="passationTermineeYn"
                  checked={formData.passationTermineeYn}
                  onCheckedChange={(checked) => setFormData({ ...formData, passationTermineeYn: checked })}
                />
                <Label htmlFor="passationTermineeYn">Passation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="visibiliteYn"
                  checked={formData.visibiliteYn}
                  onCheckedChange={(checked) => setFormData({ ...formData, visibiliteYn: checked })}
                />
                <Label htmlFor="visibiliteYn">Visibilité</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="documentationDeposeeYn"
                  checked={formData.documentationDeposeeYn}
                  onCheckedChange={(checked) => setFormData({ ...formData, documentationDeposeeYn: checked })}
                />
                <Label htmlFor="documentationDeposeeYn">Documentation déposée</Label>
              </div>
            </div>

            {/* Rating de complexité */}
            <div className="space-y-2 col-span-1">
              <Label>Complexité</Label>
              <Rating
                value={formData.niveauComplexite}
                onValueChange={(value) => setFormData({ ...formData, niveauComplexite: value })}
              >
                <RatingButton />
                <RatingButton />
                <RatingButton />
                <RatingButton />
                <RatingButton />
              </Rating>
            </div>

            <div className="space-y-2 col-span-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                rows={5}
              />
            </div>

            <div className="col-span-4 flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setOpenEditDialog(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectView;
