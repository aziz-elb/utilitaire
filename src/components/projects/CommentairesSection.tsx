import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Edit, Trash2, Filter, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { getMembres } from "@/services/membreService";
import { getTypeCommentaires } from "@/services/typeCommentaireService";
import { 
  getCommentairesProjet,
  getCommentairesByAuteur,
  createCommentaire,
  updateCommentaire,
  deleteCommentaire,
  type CommentaireProjet 
} from "@/services/commentaireProjetService";

interface CommentairesSectionProps {
  projetId: string;
}

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

// Fonction pour obtenir les initiales d'un email
const getInitiales = (email: string): string => {
  if (!email || email.length === 0) return 'U';
  
  const nom = email.split('@')[0];
  if (!nom || nom.length === 0) return 'U';
  
  const parties = nom.split('.');
  if (parties.length >= 2) {
    const premiere = parties[0] && parties[0].length > 0 ? parties[0][0] : '';
    const deuxieme = parties[1] && parties[1].length > 0 ? parties[1][0] : '';
    if (premiere && deuxieme) {
      return (premiere + deuxieme).toUpperCase();
    }
  }
  
  // Si pas de point ou pas assez de parties, prendre les 2 premiers caractères
  return nom.substring(0, 2).toUpperCase() || 'U';
};

// Fonction pour formater la date relative
const formatDateRelative = (dateString: string): string => {
  const date = new Date(dateString);
  const maintenant = new Date();
  const diffEnMs = maintenant.getTime() - date.getTime();
  const diffEnMinutes = Math.floor(diffEnMs / (1000 * 60));
  const diffEnHeures = Math.floor(diffEnMs / (1000 * 60 * 60));
  const diffEnJours = Math.floor(diffEnMs / (1000 * 60 * 60 * 24));

  if (diffEnMinutes < 1) return "À l'instant";
  if (diffEnMinutes < 60) return `Il y a ${diffEnMinutes} min`;
  if (diffEnHeures < 24) return `Il y a ${diffEnHeures}h`;
  if (diffEnJours < 7) return `Il y a ${diffEnJours}j`;
  return formatDate(dateString);
};

export const CommentairesSection = ({ projetId }: CommentairesSectionProps) => {
  const [commentaires, setCommentaires] = useState<CommentaireProjet[]>([]);
  const [nouveauCommentaire, setNouveauCommentaire] = useState("");
  const [selectedTypeCommentaire, setSelectedTypeCommentaire] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingComment, setAddingComment] = useState(false);
  
  // Filtres
  const [filterType, setFilterType] = useState<"projet" | "auteur">("projet");
  const [selectedAuteur, setSelectedAuteur] = useState("");
  const [tousMembres, setTousMembres] = useState<any[]>([]);
  const [typesCommentaire, setTypesCommentaire] = useState<any[]>([]);
  
  // Dialog d'édition
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCommentaire, setSelectedCommentaire] = useState<CommentaireProjet | null>(null);
  const [editFormData, setEditFormData] = useState({
    contenu: "",
    typeCommentaireId: "",
  });
  const [editing, setEditing] = useState(false);

  // Dialog d'ajout
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Charger les commentaires selon le filtre
  const loadCommentaires = async () => {
    if (!projetId) return;
    
    try {
      setLoading(true);
      let commentairesData: CommentaireProjet[];
      
      if (filterType === "projet") {
        commentairesData = await getCommentairesProjet(projetId);
      } else {
        if (!selectedAuteur) {
          commentairesData = [];
        } else {
          commentairesData = await getCommentairesByAuteur(selectedAuteur);
          // Filtrer pour ne garder que les commentaires du projet actuel
          commentairesData = commentairesData.filter(c => c.projetId === projetId);
        }
      }
      
      setCommentaires(commentairesData);
    } catch (error) {
      toast.error("Erreur lors du chargement des commentaires");
    } finally {
      setLoading(false);
    }
  };

  // Charger les données de référence
  const loadReferenceData = async () => {
    try {
      const [membresData, typesData] = await Promise.all([
        getMembres(),
        getTypeCommentaires()
      ]);
      setTousMembres(membresData);
      setTypesCommentaire(typesData);
    } catch (error) {
      console.log("Erreur lors du chargement des données de référence:", error);
      toast.error("Erreur lors du chargement des données de référence");
    }
  };

  // Ajouter un commentaire
  const handleAddCommentaire = async () => {
    if (!projetId || !nouveauCommentaire.trim() || !selectedTypeCommentaire) {
      toast.error("Veuillez remplir le contenu et sélectionner un type");
      return;
    }
    
    try {
      setAddingComment(true);
      
      await createCommentaire({
        projetId,
        contenu: nouveauCommentaire.trim(),
        typeCommentaireId: selectedTypeCommentaire
      });
      
      setNouveauCommentaire("");
      setSelectedTypeCommentaire("");
      await loadCommentaires();
      toast.success("Commentaire ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du commentaire");
    } finally {
      setAddingComment(false);
    }
  };

  // Supprimer un commentaire
  const handleDeleteCommentaire = async (commentaireId: string) => {
    try {
      await deleteCommentaire(commentaireId);
      await loadCommentaires();
      toast.success("Commentaire supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du commentaire");
    }
  };

  // Ouvrir le dialogue d'édition
  const handleEditCommentaire = (commentaire: CommentaireProjet) => {
    setSelectedCommentaire(commentaire);
    setEditFormData({
      contenu: commentaire.commentaire ?? "", // Utiliser commentaire.commentaire
      typeCommentaireId: commentaire.typeCommentaireId ?? "",
    });
    setOpenEditDialog(true);
  };

  // Confirmer l'édition
  const handleConfirmerEdit = async () => {
    if (!selectedCommentaire || !editFormData.contenu?.trim() || !editFormData.typeCommentaireId) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setEditing(true);
      await updateCommentaire(selectedCommentaire.id, {
        projetId,
        contenu: editFormData.contenu.trim(),
        typeCommentaireId: editFormData.typeCommentaireId,
      });
      
      setOpenEditDialog(false);
      setSelectedCommentaire(null);
      setEditFormData({
        contenu: "",
        typeCommentaireId: "",
      });
      await loadCommentaires();
      toast.success("Commentaire modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du commentaire");
    } finally {
      setEditing(false);
    }
  };

  // Fonction pour obtenir le nom du type de commentaire
  const getTypeCommentaireNom = (typeId: string) => {
    const type = typesCommentaire.find(t => t.id === typeId);
    return type?.description ?? 'Type inconnu';
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadReferenceData();
  }, []);

  useEffect(() => {
    loadCommentaires();
  }, [projetId, filterType, selectedAuteur]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Commentaires du projet
        </CardTitle>
        <CardDescription>Discussions et notes sur le projet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filtres */}
            

          

          {/* Bouton d'ajout */}
          <div className="flex justify-end">
            <Button 
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
              onClick={() => setOpenAddDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un commentaire
            </Button>
          </div>

          {/* Liste des commentaires */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Chargement des commentaires...</p>
              </div>
            ) : commentaires.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun commentaire pour le moment.</p>
                <p className="text-sm">Soyez le premier à commenter ce projet !</p>
              </div>
            ) : (
              commentaires.map((commentaire) => (
                <div key={commentaire.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-700">
                        {getInitiales(commentaire.auteurEmail)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-sm">{commentaire.auteurEmail}</span>
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                          {commentaire.typeCommentaire?.libelle ?? getTypeCommentaireNom(commentaire.typeCommentaireId ?? "")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDateRelative(commentaire.dateCreation)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {commentaire.commentaire}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCommentaire(commentaire)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCommentaire(commentaire.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>

      {/* Dialog d'ajout */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un commentaire</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de commentaire</label>
              <Select
                value={selectedTypeCommentaire}
                onValueChange={setSelectedTypeCommentaire}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type de commentaire..." />
                </SelectTrigger>
                <SelectContent>
                  {typesCommentaire.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contenu</label>
              <Textarea 
                placeholder="Ajouter un commentaire..." 
                className="flex-1"
                value={nouveauCommentaire}
                onChange={(e) => setNouveauCommentaire(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenAddDialog(false);
                setNouveauCommentaire("");
                setSelectedTypeCommentaire("");
              }}
            >
              Annuler
            </Button>
            <Button 
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
              onClick={async () => {
                await handleAddCommentaire();
                setOpenAddDialog(false);
              }}
              disabled={!nouveauCommentaire.trim() || !selectedTypeCommentaire || addingComment}
            >
              <Plus className="h-4 w-4 mr-2" />
              {addingComment ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le commentaire</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de commentaire</label>
              <Select
                value={editFormData.typeCommentaireId}
                onValueChange={(value) => setEditFormData({ ...editFormData, typeCommentaireId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type de commentaire..." />
                </SelectTrigger>
                <SelectContent>
                  {typesCommentaire.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contenu</label>
              <Textarea
                value={editFormData.contenu}
                onChange={(e) => setEditFormData({ ...editFormData, contenu: e.target.value })}
                placeholder="Contenu du commentaire..."
                rows={4}
              />
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
              disabled={!editFormData.contenu?.trim() || !editFormData.typeCommentaireId || editing}
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
            >
              {editing ? "Modification..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}; 