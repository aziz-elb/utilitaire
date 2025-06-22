"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Archive,
  Edit,
  Eye,
  MoreHorizontal,
  CirclePlus,
  BadgeCheck,
  BadgeX,
  Mail,
  Phone,
  Building,
  UserCheck,
  ShieldCheck,
  ShieldMinus,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";

const API_URL = "http://localhost:8000/membre";

type Membre = {
  id: string;
  keycloak_user_id: string;
  fk_type_membre_id: string;
  nom_prenom: string;
  email: string;
  telephone: string;
  fk_entite_id: string;
  fk_fonction_id: string;
  interne_yn: boolean;
  date_creation: string;
  profile_picture_url: string;
  actif_yn: boolean;
  last_login?: string;
  projets_count?: number;
};

interface MembreCrudProps {
  membres: Membre[];
  fonctions: Fonction[];
  entites: Entite[];
  typesMembre: TypeMembre[];
  loading: boolean;
  onMembreUpdated: (membres: Membre[]) => void;
}

export default function MembreCrud({
  membres,
  fonctions,
  entites,
  typesMembre,
  loading,
  onMembreUpdated,
}: MembreCrudProps) {
  // États principaux
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // États pour les modales
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentMembre, setCurrentMembre] = useState<Membre | null>(null);

  // État du formulaire
  const [formData, setFormData] = useState<
    Omit<Membre, "id" | "date_creation">
  >({
    keycloak_user_id: "",
    fk_type_membre_id: "",
    nom_prenom: "",
    email: "",
    telephone: "",
    fk_entite_id: "",
    fk_fonction_id: "",
    interne_yn: false,
    profile_picture_url: "",
    actif_yn: true,
  });

  // Charger les données initiales

  // Fonctions utilitaires
  const getInitials = (name: string) => {
    const parts = name?.trim().split(" ") || [];
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0]?.[0]?.toUpperCase() || "??";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getEntityName = (id: string) => {
    const entity = entites.find((e) => e.id === id);
    return entity ? entity.titre : "Inconnu";
  };

  const getFonctionName = (id: string) => {
    const fonction = fonctions.find((f) => f.id === id);
    return fonction ? fonction.libelle : "Inconnu";
  };

  const getTypeMembreName = (id: string) => {
    const type = typesMembre.find((t) => t.id === id);
    return type ? type.libelle : "Inconnu";
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getTypeColor = (isInternal: boolean) => {
    return isInternal
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  // Opérations CRUD (identique à la version précédente)
  // ... (handleAddClick, handleViewClick, handleEditClick, handleDeleteClick, etc.)

  // Gestion des formulaires
  const resetForm = () => {
    setFormData({
      keycloak_user_id: "",
      fk_type_membre_id: "",
      nom_prenom: "",
      email: "",
      telephone: "",
      fk_entite_id: "",
      fk_fonction_id: "",
      interne_yn: false,
      profile_picture_url: "",
      actif_yn: true,
    });
    setCurrentMembre(null);
  };

  // Gestion des clics
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  const handleViewClick = (membre: Membre) => {
    setCurrentMembre(membre);
    setOpenViewDialog(true);
  };

  const handleEditClick = (membre: Membre) => {
    setCurrentMembre(membre);
    setFormData({
      keycloak_user_id: membre.keycloak_user_id,
      fk_type_membre_id: membre.fk_type_membre_id,
      nom_prenom: membre.nom_prenom,
      email: membre.email,
      telephone: membre.telephone,
      fk_entite_id: membre.fk_entite_id,
      fk_fonction_id: membre.fk_fonction_id,
      interne_yn: membre.interne_yn,
      profile_picture_url: membre.profile_picture_url,
      actif_yn: membre.actif_yn,
    });
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (membre: Membre) => {
    setCurrentMembre(membre);
    setOpenDeleteDialog(true);
  };
  // Opérations CRUD
  const handleAddMembre = async () => {
    try {
      const response = await axios.post(API_URL, {
        ...formData,
        date_creation: new Date().toISOString(),
      });

      const newMembres = [...membres, response.data];
      onMembreUpdated(newMembres);

      setOpenAddDialog(false);
      resetForm();
      toast.success("Membre ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du membre");
      console.error(error);
    }
  };

  const handleEditMembre = async () => {
    if (!currentMembre) return;

    try {
      const response = await axios.put(
        `${API_URL}/${currentMembre.id}`,
        formData
      );

      const updatedMembres = membres.map((m) =>
        m.id === currentMembre.id ? response.data : m
      );
      onMembreUpdated(updatedMembres);

      setOpenEditDialog(false);
      resetForm();
      toast.success("Membre modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du membre");
      console.error(error);
    }
  };

  const handleDeleteMembre = async () => {
    if (!currentMembre) return;

    try {
      await axios.delete(`${API_URL}/${currentMembre.id}`);

      const filteredMembres = membres.filter((m) => m.id !== currentMembre.id);
      onMembreUpdated(filteredMembres);

      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Membre supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du membre");
      console.error(error);
    }
  };

  // Fonction pour activer/désactiver un membre
  const handleToggleStatus = async (membre: Membre) => {
    try {
      const newStatus = !membre.actif_yn;
      const response = await axios.patch(`${API_URL}/${membre.id}`, {
        actif_yn: newStatus,
      });

      // Mettre à jour l'état local
      setMembres(
        membres.map((m) =>
          m.id === membre.id ? { ...m, actif_yn: newStatus } : m
        )
      );

      toast.success(
        newStatus ? "Membre activé avec succès" : "Membre désactivé avec succès"
      );
    } catch (error) {
      toast.error(
        `Erreur lors de ${
          membre.actif_yn ? "la désactivation" : "l'activation"
        } du membre`
      );
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des membres</h1>
        <Button onClick={() => setOpenAddDialog(true)} className="inwiButton">
          Ajouter <CirclePlus className="ml-2" />
        </Button>
      </div>

      <Tabs
        defaultValue="table"
        onValueChange={(value) => setViewMode(value as "table" | "cards")}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="table">
            <Eye className="h-4 w-4 mr-2" /> Vue Tableau
          </TabsTrigger>
          <TabsTrigger value="cards">
            <UserCheck className="h-4 w-4 mr-2" /> Vue Cartes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          {/* Tableau des membres (identique à la version précédente) */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Nom Prénom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Fonction</TableHead>
                  <TableHead>Entité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : membres.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Aucun membre disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  membres.map((membre) => (
                    <TableRow key={membre.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={membre.profile_picture_url} />
                          <AvatarFallback>
                            {getInitials(membre.nom_prenom)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{membre.nom_prenom}</TableCell>
                      <TableCell>{membre.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-400/20 text-blue-800">
                          {getFonctionName(membre.fk_fonction_id)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-inwi-tertiary/20 text-inwi-dark-purple">
                          {getEntityName(membre.fk_entite_id)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(membre.actif_yn)}>
                          {membre.actif_yn ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white">
                            <DropdownMenuItem
                              onClick={() => handleViewClick(membre)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClick(membre)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(membre)}
                              className="text-red-600"
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={cn(
                                membre.actif_yn
                                  ? "text-red-500"
                                  : "text-green-500"
                              )}
                              onClick={() => handleToggleStatus(membre)}
                            >
                              {membre.actif_yn ? (
                                <ShieldMinus className="h-4 w-4 mr-2" />
                              ) : (
                                <ShieldCheck className="h-4 w-4 mr-2" />
                              )}
                              {membre.actif_yn ? "Désactiver" : "Activer"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="cards">
          {/* Affichage en cartes */}
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Chargement des membres...</p>
            </div>
          ) : membres.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Aucun membre disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {membres.map((membre) => (
                <Card
                  key={membre.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={membre.profile_picture_url || undefined}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-inwi-purple/60 to-inwi-dark-purple text-white">
                            {getInitials(membre.nom_prenom)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {membre.nom_prenom}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {getFonctionName(membre.fk_fonction_id)}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleViewClick(membre)}
                          >
                            <Eye className="h-4 w-4 mr-2" /> Voir profil
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditClick(membre)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(membre)}
                          >
                            <Archive className="h-4 w-4 mr-2" /> Supprimer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={cn(
                              membre.actif_yn
                                ? "text-red-500"
                                : "text-green-500"
                            )}
                            onClick={() => handleToggleStatus(membre)}
                          >
                            {membre.actif_yn ? (
                              <ShieldMinus className="h-4 w-4 mr-2" />
                            ) : (
                              <ShieldCheck className="h-4 w-4 mr-2" />
                            )}
                            {membre.actif_yn ? "Désactiver" : "Activer"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center space-x-2 mt-3">
                      <Badge className={getStatusColor(membre.actif_yn)}>
                        {membre.actif_yn ? "Actif" : "Inactif"}
                      </Badge>
                      <Badge className={getTypeColor(membre.interne_yn)}>
                        {membre.interne_yn ? "Interne" : "Externe"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="truncate">{membre.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{membre.telephone || "Non renseigné"}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="h-4 w-4 mr-2" />
                        <span className="truncate">
                          {getEntityName(membre.fk_entite_id)}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {membre.projets_count || 0}
                        </div>
                        <div className="text-xs text-gray-600">Projets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {getTypeMembreName(membre.fk_type_membre_id)}
                        </div>
                        <div className="text-xs text-gray-600">Type membre</div>
                      </div>
                    </div>

                    {/* Last Login */}
                    {membre.last_login && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center text-xs text-gray-500">
                          <UserCheck className="h-3 w-3 mr-1" />
                          <span>
                            Date Creation : {formatDate(membre.date_creation)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modale d'ajout */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un membre</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom_prenom">Nom Prénom</Label>
                <Input
                  id="nom_prenom"
                  value={formData.nom_prenom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom_prenom: e.target.value })
                  }
                  placeholder="Nom Prénom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                  placeholder="Téléphone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile_picture_url">Photo de profil</Label>
                <Input
                  id="profile_picture_url"
                  value={formData.profile_picture_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile_picture_url: e.target.value,
                    })
                  }
                  placeholder="URL de la photo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keycloak_user_id">Keycloak ID</Label>
                <Input
                  id="keycloak_user_id"
                  value={formData.keycloak_user_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      keycloak_user_id: e.target.value,
                    })
                  }
                  placeholder="Keycloak User ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fk_type_membre_id">Type de membre</Label>
                <Select
                  value={formData.fk_type_membre_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fk_type_membre_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typesMembre.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fk_fonction_id">Fonction</Label>
                <Select
                  value={formData.fk_fonction_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fk_fonction_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une fonction" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonctions.map((fonction) => (
                      <SelectItem key={fonction.id} value={fonction.id}>
                        {fonction.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fk_entite_id">Entité</Label>
                <Select
                  value={formData.fk_entite_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fk_entite_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une entité" />
                  </SelectTrigger>
                  <SelectContent>
                    {entites.map((entite) => (
                      <SelectItem key={entite.id} value={entite.id}>
                        {entite.titre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="interne"
                  checked={formData.interne_yn}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, interne_yn: checked })
                  }
                />
                <Label htmlFor="interne">Interne</Label>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="actif"
                  checked={formData.actif_yn}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, actif_yn: checked })
                  }
                />
                <Label htmlFor="actif">Actif</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddMembre}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du membre</DialogTitle>
          </DialogHeader>
          {currentMembre && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentMembre.profile_picture_url} />
                  <AvatarFallback>
                    {getInitials(currentMembre.nom_prenom)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {currentMembre.nom_prenom}
                  </h3>
                  <p className="text-sm text-gray-500">{currentMembre.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">ID</Label>
                  <div>{currentMembre.id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Keycloak ID</Label>
                  <div>{currentMembre.keycloak_user_id || "-"}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Téléphone</Label>
                  <div>{currentMembre.telephone || "-"}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Type de membre</Label>
                  <div>
                    {getTypeMembreName(currentMembre.fk_type_membre_id)}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Fonction</Label>
                  <div>{getFonctionName(currentMembre.fk_fonction_id)}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Entité</Label>
                  <div>{getEntityName(currentMembre.fk_entite_id)}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Interne</Label>
                  <div>{currentMembre.interne_yn ? "Oui" : "Non"}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Actif</Label>
                  <div>{currentMembre.actif_yn ? "Oui" : "Non"}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Date de création</Label>
                  <div>{formatDate(currentMembre.date_creation)}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setOpenViewDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'édition */}
      <Dialog
        open={openEditDialog}
        onOpenChange={(isOpen) => {
          setOpenEditDialog(isOpen);
          if (!isOpen) {
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le membre</DialogTitle>
          </DialogHeader>
          {currentMembre && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_nom_prenom">Nom Prénom</Label>
                    <Input
                      id="edit_nom_prenom"
                      value={formData.nom_prenom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom_prenom: e.target.value })
                      }
                      placeholder="Nom Prénom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_email">Email</Label>
                    <Input
                      id="edit_email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_telephone">Téléphone</Label>
                    <Input
                      id="edit_telephone"
                      value={formData.telephone}
                      onChange={(e) =>
                        setFormData({ ...formData, telephone: e.target.value })
                      }
                      placeholder="Téléphone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_profile_picture_url">
                      Photo de profil
                    </Label>
                    <Input
                      id="edit_profile_picture_url"
                      value={formData.profile_picture_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile_picture_url: e.target.value,
                        })
                      }
                      placeholder="URL de la photo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_keycloak_user_id">Keycloak ID</Label>
                    <Input
                      id="edit_keycloak_user_id"
                      value={formData.keycloak_user_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          keycloak_user_id: e.target.value,
                        })
                      }
                      placeholder="Keycloak User ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_fk_type_membre_id">
                      Type de membre
                    </Label>
                    <Select
                      value={formData.fk_type_membre_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, fk_type_membre_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {typesMembre.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.libelle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_fk_fonction_id">Fonction</Label>
                    <Select
                      value={formData.fk_fonction_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, fk_fonction_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une fonction" />
                      </SelectTrigger>
                      <SelectContent>
                        {fonctions.map((fonction) => (
                          <SelectItem key={fonction.id} value={fonction.id}>
                            {fonction.libelle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_fk_entite_id">Entité</Label>
                    <Select
                      value={formData.fk_entite_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, fk_entite_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une entité" />
                      </SelectTrigger>
                      <SelectContent>
                        {entites.map((entite) => (
                          <SelectItem key={entite.id} value={entite.id}>
                            {entite.titre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="edit_interne"
                      checked={formData.interne_yn}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, interne_yn: checked })
                      }
                    />
                    <Label htmlFor="edit_interne">Interne</Label>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="edit_actif"
                      checked={formData.actif_yn}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, actif_yn: checked })
                      }
                    />
                    <Label htmlFor="edit_actif">Actif</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenEditDialog(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" onClick={handleEditMembre}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le membre</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le membre{" "}
              <span className="font-semibold">{currentMembre?.nom_prenom}</span>{" "}
              ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteMembre}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
