import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, Activity, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { getTypeActivites } from "@/services/typeActiviteService";
import {
  getActivitesProjet,
  createActiviteProjet,
  updateActiviteProjet,
  deleteActiviteProjet,
  type ActiviteProjet,
  type ActiviteProjetInput,
  type ActiviteProjetUpdate,
} from "@/services/activiteProjetService";

interface ActiviteTabProps {
  projetId: string;
}

export const ActiviteTab = ({ projetId }: ActiviteTabProps) => {
  const [activites, setActivites] = useState<ActiviteProjet[]>([]);
  const [typesActivite, setTypesActivite] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingActivite, setAddingActivite] = useState(false);
  const [editingActivite, setEditingActivite] = useState<ActiviteProjet | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    typeActiviteId: "",
    contenu: "",
  });

  // Charger les activités du projet
  const loadActivites = async () => {
    if (!projetId) return;
    
    try {
      setLoading(true);
      const activitesData = await getActivitesProjet(projetId);
      setActivites(activitesData);
    } catch (error: any) {
      console.log("Erreur lors du chargement des activités:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        setActivites([]);
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors du chargement des activités");
      }
    } finally {
      setLoading(false);
    }
  };

  // Charger les types d'activité
  const loadTypesActivite = async () => {
    try {
      const typesData = await getTypeActivites();
      setTypesActivite(typesData);
    } catch (error: any) {
      console.log("Erreur lors du chargement des types d'activité:", error.message);
      toast.error("Erreur lors du chargement des types d'activité");
    }
  };

  // Ouvrir le dialogue pour ajouter une activité
  const handleAddActivite = () => {
    setEditingActivite(null);
    setFormData({
      typeActiviteId: "",
      contenu: "",
    });
    setOpenDialog(true);
  };

  // Ouvrir le dialogue pour éditer une activité
  const handleEditActivite = (activite: ActiviteProjet) => {
    setEditingActivite(activite);
    setFormData({
      typeActiviteId: activite.typeActiviteId,
      contenu: activite.contenu,
    });
    setOpenDialog(true);
  };

  // Sauvegarder l'activité (créer ou mettre à jour)
  const handleSaveActivite = async () => {
    if (!formData.typeActiviteId.trim() || !formData.contenu.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setAddingActivite(true);

      if (editingActivite) {
        // Mise à jour
        const updateData: ActiviteProjetUpdate = {
          typeActiviteId: formData.typeActiviteId,
          contenu: formData.contenu,
        };
        await updateActiviteProjet(editingActivite.id, updateData);
        toast.success("Activité mise à jour avec succès");
      } else {
        // Création
        const newActivite: ActiviteProjetInput = {
          projetId: projetId,
          typeActiviteId: formData.typeActiviteId,
          contenu: formData.contenu,
        };
        await createActiviteProjet(newActivite);
        toast.success("Activité créée avec succès");
      }

      setOpenDialog(false);
      await loadActivites();
    } catch (error: any) {
      console.log("Erreur lors de la sauvegarde:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors de la sauvegarde de l'activité");
      }
    } finally {
      setAddingActivite(false);
    }
  };

  // Supprimer une activité
  const handleDeleteActivite = async (activiteId: string) => {
    try {
      await deleteActiviteProjet(activiteId);
      await loadActivites();
      toast.success("Activité supprimée avec succès");
    } catch (error: any) {
      console.log("Erreur lors de la suppression:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors de la suppression de l'activité");
      }
    }
  };

  // Charger les données au montage
  useEffect(() => {
    loadActivites();
    loadTypesActivite();
  }, [projetId]);

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fonction pour obtenir le nom du type d'activité
  const getTypeActiviteNom = (typeId: string) => {
    const type = typesActivite.find(t => t.id === typeId);
    return type ? type.description : 'Type inconnu';
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Activités du projet</h3>
          <p className="text-sm text-muted-foreground">
            Suivi des activités et tâches du projet
          </p>
        </div>
        <Button 
          onClick={handleAddActivite}
          className="bg-inwi-purple/80 hover:bg-inwi-purple"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une activité
        </Button>
      </div>

      {/* Liste des activités */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chargement des activités...</p>
            </div>
          ) : activites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune activité enregistrée pour ce projet.</p>
              <p className="text-sm">Commencez par ajouter une activité.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activites.map((activite) => (
                <div key={activite.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {getTypeActiviteNom(activite.typeActiviteId)}
                        </Badge>
                        {activite.dateCreation && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(activite.dateCreation)}
                          </div>
                        )}
                      </div>
                      
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm leading-relaxed">{activite.contenu}</p>
                      </div>
                      
                      {activite.createurEmail && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          Créé par {activite.createurEmail}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditActivite(activite)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteActivite(activite.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogue pour ajouter/éditer une activité */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingActivite ? "Modifier l'activité" : "Ajouter une activité"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="typeActivite">Type d'activité</Label>
              <Select
                value={formData.typeActiviteId}
                onValueChange={(value) =>
                  setFormData({ ...formData, typeActiviteId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type d'activité" />
                </SelectTrigger>
                <SelectContent>
                  {typesActivite.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenu">Contenu</Label>
              <Textarea
                id="contenu"
                placeholder="Décrivez l'activité..."
                value={formData.contenu}
                onChange={(e) =>
                  setFormData({ ...formData, contenu: e.target.value })
                }
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSaveActivite}
              disabled={addingActivite || !formData.typeActiviteId.trim() || !formData.contenu.trim()}
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
            >
              {addingActivite ? "Sauvegarde..." : editingActivite ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 