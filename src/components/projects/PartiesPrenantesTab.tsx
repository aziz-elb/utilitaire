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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, Users, Mail, Star, Edit } from "lucide-react";
import { toast } from "sonner";
import { getMembres } from "@/services/membreService";
import { getTypePartiePrenantes } from "@/services/typePartiePrenanteService";
import { getNiveauInfluences } from "@/services/niveauInfluenceService";
import {
  getPartiesPrenantesByProjet,
  createPartiePrenante,
  updatePartiePrenante,
  deletePartiePrenante,
  type ProjetPartiePrenante,
} from "@/services/partiePrenanteProjetService";

interface PartiesPrenantesTabProps {
  projetId: string;
}

export const PartiesPrenantesTab = ({ projetId }: PartiesPrenantesTabProps) => {
  const [partiesPrenantes, setPartiesPrenantes] = useState<ProjetPartiePrenante[]>([]);
  const [selectedMembreEmail, setSelectedMembreEmail] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingPartiePrenante, setAddingPartiePrenante] = useState(false);
  const [tousMembres, setTousMembres] = useState<any[]>([]);
  const [typesPartiePrenante, setTypesPartiePrenante] = useState<any[]>([]);
  const [niveauxInfluence, setNiveauxInfluence] = useState<any[]>([]);

  // Dialog pour éditer une partie prenante
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedPartiePrenante, setSelectedPartiePrenante] = useState<ProjetPartiePrenante | null>(null);
  const [editFormData, setEditFormData] = useState({
    membreEmail: "",
    typePartiePrenanteId: "",
    niveauInfluenceId: "",
  });
  const [editing, setEditing] = useState(false);

  // Charger les parties prenantes du projet
  const loadPartiesPrenantesProjet = async () => {
    if (!projetId) return;
    
    try {
      setLoading(true);
      const partiesData = await getPartiesPrenantesByProjet(projetId);
      setPartiesPrenantes(partiesData);
    } catch (error: any) {
      console.log("Erreur lors du chargement des parties prenantes:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        setPartiesPrenantes([]);
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors du chargement des parties prenantes");
      }
    } finally {
      setLoading(false);
    }
  };

  // Charger tous les membres disponibles
  const loadTousMembres = async () => {
    try {
      const membresData = await getMembres();
      setTousMembres(membresData);
    } catch (error: any) {
      console.log("Erreur lors du chargement des membres disponibles:", error.message);
      toast.error("Erreur lors du chargement des membres disponibles");
    }
  };

  // Charger les types de parties prenantes
  const loadTypesPartiePrenante = async () => {
    try {
      const typesData = await getTypePartiePrenantes();
      setTypesPartiePrenante(typesData);
    } catch (error: any) {
      console.log("Erreur lors du chargement des types:", error.message);
      toast.error("Erreur lors du chargement des types de parties prenantes");
    }
  };

  // Charger les niveaux d'influence
  const loadNiveauxInfluence = async () => {
    try {
      const niveauxData = await getNiveauInfluences();
      setNiveauxInfluence(niveauxData);
    } catch (error: any) {
      console.log("Erreur lors du chargement des niveaux:", error.message);
      toast.error("Erreur lors du chargement des niveaux d'influence");
    }
  };

  // Assigner une partie prenante au projet
  const handleAssignerPartiePrenante = async () => {
    if (!projetId || !selectedMembreEmail.trim() || !selectedType || !selectedNiveau) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    try {
      setAddingPartiePrenante(true);
      
      await createPartiePrenante({
        projetId,
        membreEmail: selectedMembreEmail.trim(),
        typePartiePrenanteId: selectedType,
        niveauInfluenceId: selectedNiveau
      });
      
      setSelectedMembreEmail("");
      setSelectedType("");
      setSelectedNiveau("");
      await loadPartiesPrenantesProjet();
      toast.success("Partie prenante assignée avec succès");
    } catch (error: any) {
      console.log("Erreur lors de l'assignation:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors de l'assignation de la partie prenante");
      }
    } finally {
      setAddingPartiePrenante(false);
    }
  };

  // Supprimer une partie prenante du projet
  const handleSupprimerPartiePrenante = async (partiePrenanteId: string) => {
    try {
      await deletePartiePrenante(partiePrenanteId);
      await loadPartiesPrenantesProjet();
      toast.success("Partie prenante supprimée avec succès");
    } catch (error: any) {
      console.log("Erreur lors de la suppression:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors de la suppression de la partie prenante");
      }
    }
  };

  // Ouvrir le dialogue pour éditer une partie prenante
  const handleEditPartiePrenante = (partiePrenante: ProjetPartiePrenante) => {
    setSelectedPartiePrenante(partiePrenante);
    setEditFormData({
      membreEmail: partiePrenante.membreEmail,
      typePartiePrenanteId: partiePrenante.typePartiePrenanteId,
      niveauInfluenceId: partiePrenante.niveauInfluenceId,
    });
    setOpenEditDialog(true);
  };

  // Confirmer l'édition d'une partie prenante
  const handleConfirmerEdit = async () => {
    if (!selectedPartiePrenante || !editFormData.membreEmail.trim() || !editFormData.typePartiePrenanteId || !editFormData.niveauInfluenceId) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setEditing(true);
      await updatePartiePrenante(selectedPartiePrenante.id, {
        projetId,
        membreEmail: editFormData.membreEmail.trim(),
        typePartiePrenanteId: editFormData.typePartiePrenanteId,
        niveauInfluenceId: editFormData.niveauInfluenceId,
      });
      
      setOpenEditDialog(false);
      setSelectedPartiePrenante(null);
      setEditFormData({
        membreEmail: "",
        typePartiePrenanteId: "",
        niveauInfluenceId: "",
      });
      await loadPartiesPrenantesProjet();
      toast.success("Partie prenante modifiée avec succès");
    } catch (error: any) {
      console.log("Erreur lors de la modification:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors de la modification de la partie prenante");
      }
    } finally {
      setEditing(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    loadPartiesPrenantesProjet();
    loadTousMembres();
    loadTypesPartiePrenante();
    loadNiveauxInfluence();
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

  // Fonction pour obtenir le nom du membre
  const getMembreNom = (membreEmail: string) => {
    const membre = tousMembres.find(m => m.email === membreEmail);
    return membre?.nomPrenom ?? membreEmail;
  };

  // Fonction pour obtenir les initiales du membre
  const getMembreInitiales = (membreEmail: string) => {
    const membre = tousMembres.find(m => m.email === membreEmail);
    if (membre?.nomPrenom) {
      return membre.nomPrenom.substring(0, 2).toUpperCase();
    }
    return membreEmail.substring(0, 2).toUpperCase();
  };

  // Fonction pour obtenir la couleur du badge selon le niveau d'influence
  const getNiveauInfluenceColor = (niveau: string) => {
    switch (niveau.toLowerCase()) {
      case 'faible': return 'bg-gray-100 text-gray-700';
      case 'moyen': return 'bg-yellow-100 text-yellow-700';
      case 'élevé': return 'bg-orange-100 text-orange-700';
      case 'critique': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Fonction pour obtenir le nom du type de partie prenante
  const getTypePartiePrenanteNom = (typeId: string) => {
    const type = typesPartiePrenante.find(t => t.id === typeId);
    return type?.libelle ?? 'Type inconnu';
  };

  // Fonction pour obtenir le nom du niveau d'influence
  const getNiveauInfluenceNom = (niveauId: string) => {
    const niveau = niveauxInfluence.find(n => n.id === niveauId);
    return niveau?.description ?? 'Niveau inconnu';
  };

  return (
    <div className="space-y-4">
      {/* Formulaire d'assignation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assigner une partie prenante</CardTitle>
          <CardDescription>Ajouter une nouvelle partie prenante au projet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select
              value={selectedMembreEmail}
              onValueChange={setSelectedMembreEmail}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un membre..." />
              </SelectTrigger>
              <SelectContent>
                {tousMembres.map((membre) => (
                  <SelectItem key={membre.id} value={membre.email}>
                    <span>{membre.nomPrenom}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type de partie prenante..." />
              </SelectTrigger>
              <SelectContent>
                {typesPartiePrenante.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.libelle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedNiveau}
              onValueChange={setSelectedNiveau}
            >
              <SelectTrigger>
                <SelectValue placeholder="Niveau d'influence..." />
              </SelectTrigger>
              <SelectContent>
                {niveauxInfluence.map((niveau) => (
                  <SelectItem key={niveau.id} value={niveau.id}>
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3" />
                      {niveau.description}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-3">
            <Button 
              onClick={handleAssignerPartiePrenante}
              disabled={!selectedMembreEmail.trim() || !selectedType || !selectedNiveau || addingPartiePrenante}
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
            >
              <Plus className="h-4 w-4 mr-2" />
              {addingPartiePrenante ? "Assignation..." : "Assigner"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des parties prenantes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Parties prenantes du projet</CardTitle>
          <CardDescription>Liste des parties prenantes actuellement assignées</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chargement des parties prenantes...</p>
            </div>
          ) : partiesPrenantes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune partie prenante assignée à ce projet.</p>
              <p className="text-sm">Commencez par assigner une partie prenante ci-dessus.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {partiesPrenantes.map((partiePrenante) => (
                <div key={partiePrenante.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-green-700">
                        {getMembreInitiales(partiePrenante.membreEmail)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">
                          {getMembreNom(partiePrenante.membreEmail)}
                        </span>
                        <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                          {partiePrenante.typePartiePrenante?.libelle ?? getTypePartiePrenanteNom(partiePrenante.typePartiePrenanteId)}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getNiveauInfluenceColor(getNiveauInfluenceNom(partiePrenante.niveauInfluenceId))}`}
                        >
                          <Star className="h-3 w-3 mr-1" />
                          {partiePrenante.niveauInfluence?.description ?? getNiveauInfluenceNom(partiePrenante.niveauInfluenceId)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {partiePrenante.membreEmail}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPartiePrenante(partiePrenante)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSupprimerPartiePrenante(partiePrenante.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour éditer une partie prenante */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la partie prenante</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Membre</label>
              <Select
              disabled={true}
                value={editFormData.membreEmail}
                onValueChange={(value) => setEditFormData({ ...editFormData, membreEmail: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un membre..." />
                </SelectTrigger>
                <SelectContent>
                  {tousMembres.map((membre) => (
                    <SelectItem key={membre.id} value={membre.email}>
                      <span>{membre.nomPrenom}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de partie prenante</label>
              <Select
                value={editFormData.typePartiePrenanteId}
                onValueChange={(value) => setEditFormData({ ...editFormData, typePartiePrenanteId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type de partie prenante..." />
                </SelectTrigger>
                <SelectContent>
                  {typesPartiePrenante.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Niveau d'influence</label>
              <Select
                value={editFormData.niveauInfluenceId}
                onValueChange={(value) => setEditFormData({ ...editFormData, niveauInfluenceId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Niveau d'influence..." />
                </SelectTrigger>
                <SelectContent>
                  {niveauxInfluence.map((niveau) => (
                    <SelectItem key={niveau.id} value={niveau.id}>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3" />
                        {niveau.description}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenEditDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmerEdit}
              disabled={!editFormData.membreEmail.trim() || !editFormData.typePartiePrenanteId || !editFormData.niveauInfluenceId || editing}
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
            >
              {editing ? "Modification..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 