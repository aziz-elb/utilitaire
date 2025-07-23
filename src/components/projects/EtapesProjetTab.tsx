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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, Edit, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getStatutEtapes } from "@/services/statutEtapeService";
import { getTypeEtapes } from "@/services/typeEtapeService";
import {
  getEtapesProjet,
  createEtapeProjet,
  updateEtapeProjet,
  deleteEtapeProjet,
  type EtapeProjet,
  type EtapeProjetInput,
  type EtapeProjetUpdate,
} from "@/services/etapeProjetService";



interface EtapesProjetTabProps {
  projetId: string;
}

export const EtapesProjetTab = ({ projetId }: EtapesProjetTabProps) => {
  const [etapes, setEtapes] = useState<EtapeProjet[]>([]);
  const [statuts, setStatuts] = useState<any[]>([]);
  const [typesEtape, setTypesEtape] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingEtape, setAddingEtape] = useState(false);
  const [editingEtape, setEditingEtape] = useState<EtapeProjet | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    progressionPct: 0,
    ordre_execution: 1,
    priorite: "MOYEN",
    dateDebut: "",
    dateFin: "",
    statutEtapeId: "",
    typeEtapeId: "",
  });

  // Charger les étapes du projet
  const loadEtapes = async () => {
    if (!projetId) return;
    try {
      setLoading(true);
      const etapesData = await getEtapesProjet(projetId);
      setEtapes(etapesData);
    } catch (error: any) {
      console.log("Erreur lors du chargement des étapes:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        setEtapes([]);
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors du chargement des étapes");
      }
    } finally {
      setLoading(false);
    }
  };

  // Charger les données de référence
  const loadReferenceData = async () => {
    try {
      const [statutsData, typesData] = await Promise.all([
        getStatutEtapes(),
        getTypeEtapes()
      ]);
      setStatuts(statutsData);
      setTypesEtape(typesData);
    } catch (error: any) {
      console.log("Erreur lors du chargement des données de référence:", error.message);
      toast.error("Erreur lors du chargement des données de référence");
    }
  };

  // Ouvrir le dialogue pour ajouter une étape
  const handleAddEtape = () => {
    setEditingEtape(null);
    setFormData({
      titre: "",
      description: "",
      progressionPct: 0,
      ordre_execution: etapes.length + 1,
      priorite: "MOYEN",
      dateDebut: "",
      dateFin: "",
      statutEtapeId: "",
      typeEtapeId: "",
    });
    setOpenDialog(true);
  };

  // Ouvrir le dialogue pour éditer une étape
  const handleEditEtape = (etape: EtapeProjet) => {
    setEditingEtape(etape);
    setFormData({
      titre: etape.titre,
      description: etape.description,
      progressionPct: etape.progressionPct ?? 0,
      ordre_execution: etape.ordre_execution ?? 1,
      priorite: etape.priorite ?? "MOYEN",
      dateDebut: etape.dateDebut ?? "",
      dateFin: etape.dateFin ?? "",
      statutEtapeId: etape.statutEtapeId ?? "",
      typeEtapeId: etape.typeEtapeId ?? "",
    });
    setOpenDialog(true);
  };

  // Sauvegarder l'étape (créer ou mettre à jour)
  const handleSaveEtape = async () => {
    if (!formData.titre.trim() || !formData.statutEtapeId || !formData.typeEtapeId) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    try {
      setAddingEtape(true);
      if (editingEtape) {
        // Mise à jour
        const updateData = {
          titre: formData.titre,
          description: formData.description,
          progressionPct: formData.progressionPct,
          ordre_execution: formData.ordre_execution,
          priorite: formData.priorite,
          dateDebut: formData.dateDebut,
          dateFin: formData.dateFin,
          statutId: formData.statutEtapeId, // <- important pour l'API
          typeEtapeId: formData.typeEtapeId,
        };
        await updateEtapeProjet(editingEtape.id, updateData);
        toast.success("Étape mise à jour avec succès");
      } else {
        // Création
        const newEtape = {
          projetId: projetId,
          titre: formData.titre,
          description: formData.description,
          progressionPct: formData.progressionPct,
          ordre_execution: formData.ordre_execution,
          priorite: formData.priorite,
          dateDebut: formData.dateDebut,
          dateFin: formData.dateFin,
          statutId: formData.statutEtapeId, // <- important pour l'API
          typeEtapeId: formData.typeEtapeId,
        };
        await createEtapeProjet(newEtape);
        toast.success("Étape créée avec succès");
      }
      setOpenDialog(false);
      await loadEtapes();
    } catch (error: any) {
      console.log("Erreur lors de la sauvegarde:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors de la sauvegarde de l'étape");
      }
    } finally {
      setAddingEtape(false);
    }
  };

  // Supprimer une étape
  const handleDeleteEtape = async (etapeId: string) => {
    try {
      await deleteEtapeProjet(etapeId);
      await loadEtapes();
      toast.success("Étape supprimée avec succès");
    } catch (error: any) {
      console.log("Erreur lors de la suppression:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors de la suppression de l'étape");
      }
    }
  };

  // Changer l'ordre des étapes (désactivé)
  // const handleOrderChange = async (etapeId: string, direction: "up" | "down") => {
  //   // Désactivé avec la nouvelle API
  // };

  // Charger les données au montage
  useEffect(() => {
    loadEtapes();
    loadReferenceData();
  }, [projetId]);

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Fonction pour obtenir le nom du statut
  const getStatutNom = (statutId: string) => {
    const statut = statuts.find(s => s.id === statutId);
    return statut ? statut.libelle : 'Statut inconnu';
  };

  // Fonction pour obtenir le nom du type d'étape
  const getTypeEtapeNom = (typeId: string) => {
    const type = typesEtape.find(t => t.id === typeId);
    return type ? type.libelle : 'Type inconnu';
  };

  // Fonction pour obtenir la couleur de la priorité
  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'HAUTE': return 'bg-red-100 text-red-700';
      case 'MOYEN': return 'bg-yellow-100 text-yellow-700';
      case 'BAS': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Étapes du projet</h3>
          <p className="text-sm text-muted-foreground">
            Gestion des étapes et phases du projet
          </p>
        </div>
        <Button 
          onClick={handleAddEtape}
          className="bg-inwi-purple/80 hover:bg-inwi-purple"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une étape
        </Button>
      </div>

      {/* Liste des étapes */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chargement des étapes...</p>
            </div>
          ) : etapes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune étape définie pour ce projet.</p>
              <p className="text-sm">Commencez par ajouter une étape.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {etapes.map((etape) => (
                <div key={etape.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700">{etape.ordre_execution}</span>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">{etape.titre}</h4>
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                            {getTypeEtapeNom(etape.typeEtapeId ?? "")}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getPrioriteColor(etape.priorite ?? "")}`}
                          >
                            {etape.priorite ?? ""}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-red-100 text-red-700">
                            {getStatutNom(etape.statutEtapeId ?? "")}
                          </Badge>
                        </div>
                        
                        {etape.description && (
                          <p className="text-sm text-muted-foreground">{etape.description}</p>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Progression: {etape.progressionPct ?? 0}%</span>
                            <span>•</span>
                            <span>Du {formatDate(etape.dateDebut ?? "")} au {formatDate(etape.dateFin ?? "")}</span>
                          </div>
                          <Progress value={etape.progressionPct ?? 0} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEtape(etape)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEtape(etape.id)}
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

      {/* Dialogue pour ajouter/éditer une étape */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEtape ? "Modifier l'étape" : "Ajouter une étape"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projetId">Projet ID</Label>
                <Input
                  id="projetId"
                  value={projetId}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ordre_execution">Ordre d'exécution</Label>
                <Input
                  id="ordre_execution"
                  type="number"
                  min="1"
                  value={formData.ordre_execution}
                  onChange={(e) =>
                    setFormData({ ...formData, ordre_execution: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) =>
                    setFormData({ ...formData, titre: e.target.value })
                  }
                  placeholder="Titre de l'étape"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priorite">Priorité</Label>
                <Input
                  id="priorite"
                  value={formData.priorite}
                  onChange={(e) =>
                    setFormData({ ...formData, priorite: e.target.value })
                  }
                  placeholder="Priorité (ex: Basse, Moyenne, Haute)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description de l'étape..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateDebut && "text-muted-foreground"
                      )}
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
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateFin && "text-muted-foreground"
                      )}
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="statutEtapeId">Statut *</Label>
                <Select
                  value={formData.statutEtapeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, statutEtapeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuts.map((statut) => (
                      <SelectItem key={statut.id} value={statut.id}>
                        {statut.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="typeEtapeId">Type d'étape *</Label>
                <Select
                  value={formData.typeEtapeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, typeEtapeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typesEtape.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progression">Progression ({formData.progressionPct}%)</Label>
              <Input
                type="number"
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSaveEtape}
              disabled={addingEtape || !formData.titre.trim() || !formData.statutEtapeId || !formData.typeEtapeId}
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
            >
              {addingEtape ? "Sauvegarde..." : editingEtape ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 