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
import { Plus, Trash2, User, Mail, Edit } from "lucide-react";
import { toast } from "sonner";
import { getMembres } from "@/services/membreService";
import { getRoleProjets } from "@/services/roleProjetService";
import {
  assignerMembre,
  getMembresByProjet,
  supprimerMembre,
  changerRoleMembre,
  type ProjetMembre,
} from "@/services/membreProjetService";
 
interface MembresTabProps {
  projetId: string;
}

export const MembresTab = ({ projetId }: MembresTabProps) => {
  const [membres, setMembres] = useState<ProjetMembre[]>([]);
  const [selectedMembreEmail, setSelectedMembreEmail] = useState("");
  const [selectedRoleProjetId, setSelectedRoleProjetId] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingMembre, setAddingMembre] = useState(false);
  const [tousMembres, setTousMembres] = useState<any[]>([]);
  const [rolesProjet, setRolesProjet] = useState<any[]>([]);
  
  // Dialog pour changer le rôle
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedMembreForRole, setSelectedMembreForRole] = useState<ProjetMembre | null>(null);
  const [newRoleProjetId, setNewRoleProjetId] = useState("");
  const [changingRole, setChangingRole] = useState(false);

  // Charger les membres du projet
  const loadMembresProjet = async () => {
    if (!projetId) return;
    
    try {
      setLoading(true);
      const membresData = await getMembresByProjet(projetId);
      setMembres(membresData);
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

  // Charger tous les rôles de projet disponibles
  const loadRolesProjet = async () => {
    try {
      const rolesData = await getRoleProjets();
      setRolesProjet(rolesData);
    } catch (error: any) {
      console.log("Erreur lors du chargement des rôles de projet:", error.message);
      toast.error("Erreur lors du chargement des rôles de projet");
    }
  };

  // Assigner un membre au projet
  const handleAssignerMembre = async () => {
    if (!projetId || !selectedMembreEmail.trim() || !selectedRoleProjetId) {
      toast.error("Veuillez sélectionner un membre et un rôle");
      return;
    }
    
    try {
      setAddingMembre(true);
      
      await assignerMembre({
        projetId,
        membreEmail: selectedMembreEmail.trim(),
        roleProjetId: selectedRoleProjetId
      });
      
      setSelectedMembreEmail("");
      setSelectedRoleProjetId("");
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
      await supprimerMembre(membreId);
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

  // Ouvrir le dialogue pour changer le rôle
  const handleChangerRole = (membre: ProjetMembre) => {
    setSelectedMembreForRole(membre);
    setNewRoleProjetId(membre.roleProjetId || "");
    setOpenRoleDialog(true);
  };

  // Confirmer le changement de rôle
  const handleConfirmerChangementRole = async () => {
    if (!selectedMembreForRole || !newRoleProjetId) {
      toast.error("Veuillez sélectionner un nouveau rôle");
      return;
    }

    try {
      setChangingRole(true);
      await changerRoleMembre(selectedMembreForRole.id, {
        nouveauRoleProjetId: newRoleProjetId
      });
      
      setOpenRoleDialog(false);
      setSelectedMembreForRole(null);
      setNewRoleProjetId("");
      await loadMembresProjet();
      toast.success("Rôle modifié avec succès");
    } catch (error: any) {
      console.log("Erreur lors du changement de rôle:", error.message);
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast.info("Fonctionnalité en cours de développement");
      } else {
        toast.error("Erreur lors du changement de rôle");
      }
    } finally {
      setChangingRole(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    loadMembresProjet();
    loadTousMembres();
    loadRolesProjet();
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

  // Fonction pour obtenir le nom du rôle
  const getRoleNom = (roleId: string) => {
    const role = rolesProjet.find(r => r.id === roleId);
    return role?.libelle ?? 'Rôle inconnu';
  };

  return (
    <div className="space-y-4">
      {/* Formulaire d'assignation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assigner un membre</CardTitle>
          <CardDescription>Ajouter un nouveau membre au projet avec un rôle spécifique</CardDescription>
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
            <div className="flex-1">
              <Select
                value={selectedRoleProjetId}
                onValueChange={setSelectedRoleProjetId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle..." />
                </SelectTrigger>
                <SelectContent>
                  {rolesProjet.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                        <span>{role.libelle}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAssignerMembre}
              disabled={!selectedMembreEmail.trim() || !selectedRoleProjetId || addingMembre}
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
                        {getMembreInitiales(membre.membreEmail)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {getMembreNom(membre.membreEmail)}
                        </span>
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                          {membre.roleProjet?.libelle ?? getRoleNom(membre.roleProjetId ?? "")}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(membre.dateAffectation ?? membre.dateCreation ?? "")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {membre.membreEmail}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleChangerRole(membre)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSupprimerMembre(membre.id)}
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

      {/* Dialog pour changer le rôle */}
      <Dialog open={openRoleDialog} onOpenChange={setOpenRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer le rôle du membre</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Membre</label>
              <p className="text-sm text-muted-foreground">
                {selectedMembreForRole?.membreEmail}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nouveau rôle</label>
              <Select
                value={newRoleProjetId}
                onValueChange={setNewRoleProjetId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un nouveau rôle..." />
                </SelectTrigger>
                <SelectContent>
                  {rolesProjet.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                        <span>{role.libelle}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenRoleDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmerChangementRole}
              disabled={!newRoleProjetId || changingRole}
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
            >
              {changingRole ? "Modification..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 