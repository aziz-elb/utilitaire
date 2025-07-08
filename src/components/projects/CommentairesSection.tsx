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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { 
  addCommentaireProjet, 
  getCommentairesProjet, 
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
  const [loading, setLoading] = useState(false);
  const [addingComment, setAddingComment] = useState(false);

  // Charger les commentaires
  const loadCommentaires = async () => {
    if (!projetId) return;
    
    try {
      setLoading(true);
      const commentairesData = await getCommentairesProjet(projetId);
      setCommentaires(commentairesData);
    } catch (error) {
      toast.error("Erreur lors du chargement des commentaires");
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un commentaire
  const handleAddCommentaire = async () => {
    if (!projetId || !nouveauCommentaire.trim()) return;
    
    try {
      setAddingComment(true);
      
      // Envoyer le commentaire au backend
      await addCommentaireProjet(projetId, { contenu: nouveauCommentaire.trim() });
      
      // Vider le champ de saisie
      setNouveauCommentaire("");
      
      // Recharger les commentaires pour afficher le nouveau
      await loadCommentaires();
      
      toast.success("Commentaire ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du commentaire");
    } finally {
      setAddingComment(false);
    }
  };

  // Charger les commentaires au montage du composant
  useEffect(() => {
    loadCommentaires();
  }, [projetId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commentaires du projet</CardTitle>
        <CardDescription>Discussions et notes sur le projet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Textarea 
              placeholder="Ajouter un commentaire..." 
              className="flex-1"
              value={nouveauCommentaire}
              onChange={(e) => setNouveauCommentaire(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddCommentaire();
                }
              }}
            />
            <Button 
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
              onClick={handleAddCommentaire}
              disabled={!nouveauCommentaire.trim() || addingComment}
            >
              <Plus className="h-4 w-4 mr-2" />
              {addingComment ? "Ajout..." : "Ajouter"}
            </Button>
          </div>
          
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
                <div key={commentaire.id || `temp-${Date.now()}`} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-700">
                        {getInitiales(commentaire.auteurEmail)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{commentaire.auteurEmail}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateRelative(commentaire.dateCreation)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {commentaire.contenu}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 