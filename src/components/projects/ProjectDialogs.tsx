import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { addProject, type ProjectInput } from "@/services/projectService";
import { deleteProject } from "@/services/projectService";
import { getTemplates } from "@/services/templateService";
import type { TemplateProjet } from "@/services/templateService";
import { getTypeProjets } from "@/services/typeProjetService";
import type { TypeProjet } from "@/services/typeProjetService";
import { getStatutProjets } from "@/services/statutProjetService";
import type { StatutProjet } from "@/services/statutProjetService";
import { getNiveauInfluences } from "@/services/niveauInfluenceService";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import axios from "axios";
import { Slider } from "@/components/ui/slider";
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { Form } from "../ui/form";

type ProjectDialogProps = {
  openAddDialog: boolean;
  setOpenAddDialog: (open: boolean) => void;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (open: boolean) => void;
  currentProject: any | null;
  setCurrentProject: (project: any | null) => void;
  refreshProjects: () => Promise<void>;
};

export const ProjectDialogs = ({ 
  openAddDialog, 
  setOpenAddDialog,
  openDeleteDialog,
  setOpenDeleteDialog,
  currentProject,
  setCurrentProject,
  refreshProjects
}: ProjectDialogProps) => {
  const initialFormData: ProjectInput = {
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
    niveauComplexite: 1,
    passationTermineeYn: false,
    visibiliteYn: false,
    documentationDeposeeYn: false,
  };
  const [formData, setFormData] = useState<ProjectInput>(initialFormData);

  const [templates, setTemplates] = useState<TemplateProjet[]>([]);
  const [typeProjets, setTypeProjets] = useState<TypeProjet[]>([]);
  const [statutProjets, setStatutProjets] = useState<StatutProjet[]>([]);
  const [niveauInfluences, setNiveauInfluences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // États pour les dates
  const [dateDebut, setDateDebut] = useState<Date | undefined>(undefined);
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined);
  const [dateCible, setDateCible] = useState<Date | undefined>(undefined);

  // Charger les données dynamiques
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [templatesData, typeProjetsData, statutProjetsData, niveauData] = await Promise.all([
          getTemplates(),
          getTypeProjets(),
          getStatutProjets(),
          getNiveauInfluences()
        ]);
        setTemplates(templatesData);
        setTypeProjets(typeProjetsData);
        setStatutProjets(statutProjetsData);
        setNiveauInfluences(niveauData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    if (openAddDialog) {
      fetchData();
    }
  }, [openAddDialog]);

  const handleAddProject = async () => {
    
    try {
      await addProject(formData);
      toast.success("Projet créé avec succès");
      setOpenAddDialog(false);
      await refreshProjects();
    } catch (error) {
      console.error('Erreur dans handleAddProject:', error);
      toast.error("Erreur lors de la création du projet");
      console.error(error);
    }
  };

  // Ajoutez cette fonction pour gérer la suppression
  const handleDeleteProject = async () => {
    if (!currentProject) return;
    
    try {
      await deleteProject(currentProject.id);
      toast.success("Projet supprimé avec succès");
      setOpenDeleteDialog(false);
      await refreshProjects();
    } catch (error) {
      toast.error("Erreur lors de la suppression du projet");
      console.error(error);
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

  return (
    <>
      {/* Dialogue d'ajout */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Nouveau Projet</DialogTitle>
          </DialogHeader>

          <form 
            className="space-y-6 max-w-3xl py-5 grid grid-cols-4 gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await handleAddProject();
                setFormData(initialFormData);
                setDateDebut(undefined);
                setDateFin(undefined);
                setDateCible(undefined);
              } catch (error) {
                // error handled in handleAddProject
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
                            disabled={loading}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un type de projet"} />
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
                            disabled={loading}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un statut"} />
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
                            disabled={loading}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un template"} />
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
                    <Calendar
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
                    <Calendar
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
                    <Calendar
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
              <Button variant="outline" type="button" onClick={() => setOpenAddDialog(false)}>
                Annuler
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le projet</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le projet "{currentProject?.titre}" ? 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpenDeleteDialog(false)}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProject}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      

      {/* Vous pouvez ajouter d'autres dialogues ici (édition, suppression, etc.) */}
    </>
  );
};
