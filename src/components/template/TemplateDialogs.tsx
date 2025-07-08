import { useState } from "react";
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
import axios from "axios";

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
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    code: "",
    fk_type_projet_id: "",
    date_debut: "",
    date_fin: "",
    date_cible: "",
    fk_statut_projet_id: "",
    progression_pct: 0,
    niveau_complexite: 1,
  });

  const handleAddProject = async () => {
    try {
      const response = await axios.post("http://localhost:8000/projet", {
        ...formData,
        date_creation: new Date().toISOString(),
        documentation_deposee_yn: false,
        passation_terminee_yn: false,
        visibilite_yn: true,
      });

      toast.success("Projet créé avec succès");
      setOpenAddDialog(false);
      // Vous pourriez vouloir rafraîchir les données ici
    } catch (error) {
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouveau Projet</DialogTitle>
            <DialogDescription>
              Remplissez les détails du nouveau projet
            </DialogDescription>
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
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
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
              <div className="space-y-2">
                <Label htmlFor="date_debut">Date de début</Label>
                <Input
                  id="date_debut"
                  type="date"
                  value={formData.date_debut}
                  onChange={(e) =>
                    setFormData({ ...formData, date_debut: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_fin">Date de fin</Label>
                <Input
                  id="date_fin"
                  type="date"
                  value={formData.date_fin}
                  onChange={(e) =>
                    setFormData({ ...formData, date_fin: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_cible">Date cible</Label>
                <Input
                  id="date_cible"
                  type="date"
                  value={formData.date_cible}
                  onChange={(e) =>
                    setFormData({ ...formData, date_cible: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de projet</Label>
                <Select
                  value={formData.fk_type_projet_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fk_type_projet_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Interne</SelectItem>
                    <SelectItem value="2">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.fk_statut_projet_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fk_statut_projet_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">En attente</SelectItem>
                    <SelectItem value="2">En cours</SelectItem>
                    <SelectItem value="3">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddProject} className="inwi_btn">Créer</Button>
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
