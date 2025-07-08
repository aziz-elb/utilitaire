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
import { getTemplates, getEtapeModeles } from "@/services/templateService";
import { getNiveauInfluences } from "@/services/niveauInfluenceService";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  const [formData, setFormData] = useState<ProjectInput>({
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

  const [templates, setTemplates] = useState<any[]>([]);
  const [etapeModeles, setEtapeModeles] = useState<any[]>([]);
  const [allEtapeModeles, setAllEtapeModeles] = useState<any[]>([]);
  const [niveauInfluences, setNiveauInfluences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les données des modèles, étapes et niveaux d'influence
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [templatesData, etapesData, niveauData] = await Promise.all([
          getTemplates(),
          getEtapeModeles(),
          getNiveauInfluences()
        ]);
        setTemplates(templatesData);
        setAllEtapeModeles(etapesData);
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

  // Filtrer les étapes selon le modèle sélectionné
  useEffect(() => {
    if (formData.modeleProjetId && allEtapeModeles.length > 0) {
      const filteredEtapes = allEtapeModeles.filter(
        etape => etape.modeleProjetId === formData.modeleProjetId
      );
      setEtapeModeles(filteredEtapes);
      // Réinitialiser l'étape sélectionnée si elle n'appartient pas au nouveau modèle
      if (!filteredEtapes.find(etape => etape.id === formData.etapeModeleId)) {
        setFormData(prev => ({ ...prev, etapeModeleId: "" }));
      }
    } else {
      setEtapeModeles([]);
    }
  }, [formData.modeleProjetId, allEtapeModeles]);

  const handleAddProject = async () => {
    console.log('=== PROJECT DIALOGS - AVANT ENVOI ===');
    console.log('formData complet:', formData);
    console.log('Validation des données:');
    console.log('  titre:', formData.titre, '(requis:', !!formData.titre, ')');
    console.log('  description:', formData.description);
    console.log('  modeleProjetId:', formData.modeleProjetId, '(requis:', !!formData.modeleProjetId, ')');
    console.log('  etapeModeleId:', formData.etapeModeleId, '(requis:', !!formData.etapeModeleId, ')');
    console.log('  dateDebut:', formData.dateDebut);
    console.log('  dateFin:', formData.dateFin);
    console.log('  dateCible:', formData.dateCible);
    console.log('  progressionPct:', formData.progressionPct, '(type:', typeof formData.progressionPct, ')');
    console.log('  niveauComplexite:', formData.niveauComplexite);
    console.log('  documentationDeposeeYn:', formData.documentationDeposeeYn, '(type:', typeof formData.documentationDeposeeYn, ')');
    console.log('  passationTermineeYn:', formData.passationTermineeYn, '(type:', typeof formData.passationTermineeYn, ')');
    
    try {
      console.log('Appel du service addProject...');
      await addProject(formData);
      console.log('Projet créé avec succès');
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
      await axios.delete(`http://localhost:8000/projet/${currentProject.id}`);
      toast.success("Projet supprimé avec succès");
      setOpenDeleteDialog(false);
      await refreshProjects();
    } catch (error) {
      toast.error("Erreur lors de la suppression du projet");
      console.error(error);
    }
  };


  return (
    <>
      {/* Dialogue d'ajout */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau Projet</DialogTitle>
            <DialogDescription>
              Remplissez les détails du nouveau projet
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Titre et Description */}
              <div className="space-y-2">
              <Label htmlFor="titre">Titre du projet *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) =>
                    setFormData({ ...formData, titre: e.target.value })
                  }
                placeholder="Nom du projet"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description détaillée du projet"
                rows={3}
              />
            </div>

            {/* Modèle et Étape Modèle */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modeleProjetId">Modèle de projet</Label>
                <Select
                  value={formData.modeleProjetId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, modeleProjetId: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un modèle"} />
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
                <Label htmlFor="etapeModeleId">Étape du modèle</Label>
                <Select
                  value={formData.etapeModeleId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, etapeModeleId: value })
                  }
                  disabled={loading || !formData.modeleProjetId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !formData.modeleProjetId 
                        ? "Sélectionnez d'abord un modèle" 
                        : loading 
                          ? "Chargement..." 
                          : "Sélectionner une étape"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {etapeModeles.map((etape) => (
                      <SelectItem key={etape.id} value={etape.id}>
                        {etape.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateDebut ? format(new Date(formData.dateDebut), "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateDebut ? new Date(formData.dateDebut) : undefined}
                      onSelect={(date) =>
                        setFormData({ ...formData, dateDebut: date ? format(date, "yyyy-MM-dd") : "" })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateFin ? format(new Date(formData.dateFin), "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateFin ? new Date(formData.dateFin) : undefined}
                      onSelect={(date) =>
                        setFormData({ ...formData, dateFin: date ? format(date, "yyyy-MM-dd") : "" })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Date cible</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateCible ? format(new Date(formData.dateCible), "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateCible ? new Date(formData.dateCible) : undefined}
                      onSelect={(date) =>
                        setFormData({ ...formData, dateCible: date ? format(date, "yyyy-MM-dd") : "" })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Progression et Complexité */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="progressionPct">Progression (%)</Label>
                <Input
                  id="progressionPct"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.progressionPct}
                  onChange={(e) =>
                    setFormData({ ...formData, progressionPct: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="niveauComplexite">Niveau de complexité</Label>
                <Select
                  value={formData.niveauComplexite}
                  onValueChange={(value) =>
                    setFormData({ ...formData, niveauComplexite: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner la complexité"} />
                  </SelectTrigger>
                  <SelectContent>
                    {niveauInfluences.map((niveau) => (
                      <SelectItem key={niveau.id} value={niveau.description}>
                        {niveau.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Switches */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="documentationDeposeeYn"
                  checked={formData.documentationDeposeeYn}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, documentationDeposeeYn: checked })
                  }
                />
                <Label htmlFor="documentationDeposeeYn">Documentation déposée</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="passationTermineeYn"
                  checked={formData.passationTermineeYn}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, passationTermineeYn: checked })
                  }
                />
                <Label htmlFor="passationTermineeYn">Passation terminée</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddProject} className="bg-inwi-purple/80 hover:bg-inwi-purple">
              Créer le projet
            </Button>
          </DialogFooter>
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
