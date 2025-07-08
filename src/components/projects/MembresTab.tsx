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
import { Plus, Trash2, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { getMembres } from "@/services/membreService";
import api from "@/services/api";

interface MembresTabProps {
  projetId: string;
}

interface ProjetMembre {
  id: string;
  membreEmail: string;
  createurEmail: string;
  dateCreation: string;
  modificateurEmail?: string;
  dateModification?: string;
}

export const MembresTab = ({ projetId }: MembresTabProps) => {
  const [membres, setMembres] = useState<ProjetMembre[]>([]);
  const [selectedMembreEmail, setSelectedMembreEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingMembre, setAddingMembre] = useState(false);
  const [tousMembres, setTousMembres] = useState<any[]>([]);

  // Charger les membres du projet
  const loadMembresProjet = async () => {
    if (!projetId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/projet-membres/projet/${projetId}`);
      setMembres(response.data);
    } catch (error: any) {
      console.log("Erreur lors du chargement des membres:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        setMembres([]);
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors du chargement des membres");
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

  // Assigner un membre au projet
  const handleAssignerMembre = async () => {
    if (!projetId || !selectedMembreEmail.trim()) return;
    
    try {
      setAddingMembre(true);
      
      const response = await api.post(`/projet-membres/assigner?projetId=${projetId}&membreEmail=${selectedMembreEmail.trim()}`);
      
      setSelectedMembreEmail("");
      await loadMembresProjet();
      toast.success("Membre assigné avec succès");
    } catch (error: any) {
      console.log("Erreur lors de l'assignation:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors de l'assignation du membre");
      }
    } finally {
      setAddingMembre(false);
    }
  };

  // Supprimer un membre du projet
  const handleSupprimerMembre = async (membreId: string) => {
    try {
      await api.delete(`/projet-membres/${membreId}`);
      await loadMembresProjet();
      toast.success("Membre supprimé avec succès");
    } catch (error: any) {
      console.log("Erreur lors de la suppression:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors de la suppression du membre");
      }
    }
  };

  // Charger les données au montage
  useEffect(() => {
    loadMembresProjet();
    loadTousMembres();
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

  // Fonction pour obtenir les initiales
  const getInitiales = (nom: string, prenom: string): string => {
    const initialeNom = nom ? nom[0] : '';
    const initialePrenom = prenom ? prenom[0] : '';
    return (initialePrenom + initialeNom).toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Formulaire d'assignation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assigner un membre</CardTitle>
          <CardDescription>Ajouter un nouveau membre au projet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
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
            </div>
            <Button 
              onClick={handleAssignerMembre}
              disabled={!selectedMembreEmail.trim() || addingMembre}
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
            >
              <Plus className="h-4 w-4 mr-2" />
              {addingMembre ? "Assignation..." : "Assigner"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des membres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Membres du projet</CardTitle>
          <CardDescription>Liste des membres actuellement assignés</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chargement des membres...</p>
            </div>
          ) : membres.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun membre assigné à ce projet.</p>
              <p className="text-sm">Commencez par assigner un membre ci-dessus.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {membres.map((membre) => (
                <div key={membre.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-700">
                        {membre.membreEmail.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {membre.membreEmail}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Membre
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(membre.dateCreation)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {membre.membreEmail}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSupprimerMembre(membre.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 