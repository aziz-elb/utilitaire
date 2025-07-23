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
  UserPlus,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getMembres,
  addMembre,
  updateMembrePartial,
  deleteMembre,
  assignMembreToRole,
  type Membre as ServiceMembre,
  type MembreInput,
} from "@/services/membreService";
import type { Entite } from '@/services/entiteService';
import type { Fonction } from '@/services/fonctionService';
import type { TypeMembre } from '@/services/typeMembreService';
import type { Role } from '@/services/roleService';

// Use the Membre type from the service
type Membre = ServiceMembre;

interface MembreCrudProps {
  membres: Membre[];
  fonctions: Fonction[];
  entites: Entite[];
  typesMembre: TypeMembre[];
  roles: Role[];
  loading: boolean;
  onMembreUpdated: (membres: Membre[]) => void;
}

export default function MembreCrud({
  membres,
  fonctions,
  entites,
  typesMembre,
  roles,
  loading,
  onMembreUpdated,
}: MembreCrudProps) {
  // États principaux
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // États pour les modales
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAssignRoleDialog, setOpenAssignRoleDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentMembre, setCurrentMembre] = useState<Membre | null>(null);

  // État du formulaire
  const [formData, setFormData] = useState<MembreInput>({
    nomPrenom: "",
    email: "",
    telephone: "",
    interneYn: true,
    actifYn: true,
    role: "USER",
    photoProfile: "",
    password: "",
    typeMembreId: "",
    entiteId: "",
    fonctionId: "",
  });

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

  // Update getEntityName, getFonctionName, getTypeMembreName, getRoleName to use new interfaces
  const getEntityName = (entiteId:string) => {
    return entites.find(e => e.id === entiteId)?.titre || 'Inconnu';
  };
  const getFonctionName = (fonctionId:string) => {
    return fonctions.find(f => f.id === fonctionId)?.libelle || 'Inconnu';
  };
  const getTypeMembreName = (typeMembreId:string) => {
    return typesMembre.find(t => t.id === typeMembreId)?.libelle || 'Inconnu';
  };
  const getRoleName = (roleName:string) => {
    return roles.find(r => r.name === roleName)?.name || 'Inconnu';
  };

  // Add a utility for badge color harmony
  const getFonctionBadgeColor = (fonctionId: string) => {
    // Example: assign colors based on fonctionId hash or known ids
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-green-100 text-green-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800',
      'bg-orange-100 text-orange-800',
    ];
    if (!fonctionId) return 'bg-gray-100 text-gray-800';
    let hash = 0;
    for (let i = 0; i < fonctionId.length; i++) hash += fonctionId.charCodeAt(i);
    return colors[hash % colors.length];
  };
  const getTypeBadgeColor = (typeId: string) => {
    // Example: assign colors based on typeId hash or known ids
    const colors = [
      'bg-purple-100 text-purple-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800',
      'bg-orange-100 text-orange-800',
    ];
    if (!typeId) return 'bg-gray-100 text-gray-800';
    let hash = 0;
    for (let i = 0; i < typeId.length; i++) hash += typeId.charCodeAt(i);
    return colors[hash % colors.length];
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getTypeColor = (isInternal: boolean) => {
    return isInternal ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800";
  };

  // Gestion des formulaires
  const resetForm = () => {
    setFormData({
      nomPrenom: "",
      email: "",
      telephone: "",
      interneYn: true,
      actifYn: true,
      role: "USER",
      photoProfile: "",
      password: "",
      typeMembreId: "",
      entiteId: "",
      fonctionId: "",
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
      nomPrenom: membre.nomPrenom,
      email: membre.email,
      telephone: membre.telephone,
      interneYn: membre.interneYn,
      actifYn: membre.actifYn,
      role: membre.role,
      photoProfile: membre.profilePictureUrl,
      password: "",
      typeMembreId: membre.typeMembreId,
      entiteId: membre.entiteId,
      fonctionId: membre.fonctionId,
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
      await addMembre(formData);
      const updatedMembres = await getMembres();
      onMembreUpdated(updatedMembres);
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
      await updateMembrePartial(currentMembre.id, formData);
      const updatedMembres = await getMembres();
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
      await deleteMembre(currentMembre.id);
      const updatedMembres = await getMembres();
      onMembreUpdated(updatedMembres);
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
      const newStatus = !membre.actifYn;
      await updateMembrePartial(membre.id, { actifYn: newStatus });
      const updatedMembres = await getMembres();
      onMembreUpdated(updatedMembres);
      toast.success(
        newStatus ? "Membre activé avec succès" : "Membre désactivé avec succès"
      );
    } catch (error) {
      toast.error(
        `Erreur lors de ${
          membre.actifYn ? "la désactivation" : "l'activation"
        } du membre`
      );
      console.error(error);
    }
  };

  const handleAssignRoleClick = (membre: Membre) => {
    setCurrentMembre(membre);
    setOpenAssignRoleDialog(true);
  };
  const handleAssignRole = async () => {
    if (!currentMembre) return;
    try {
      await assignMembreToRole(currentMembre.keycloakUserId, formData.role);
      setOpenAssignRoleDialog(false);
      toast.success("Rôle assigné avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'assignation du rôle");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des membres</h1>
        <Button onClick={handleAddClick} className="inwi_btn">
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
          {/* Tableau des membres */}
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
                  <TableHead>Rôle</TableHead>
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
                          <AvatarImage src={membre.profilePictureUrl} />
                          <AvatarFallback>
                            {getInitials(membre.nomPrenom)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{membre.nomPrenom}</TableCell>
                      <TableCell>{membre.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-blue-400/20 text-blue-800"
                        >
                          {getFonctionName(membre.fonctionId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-inwi-tertiary/20 text-inwi-dark-purple"
                        >
                          {getEntityName(membre.entiteId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(membre.actifYn)}>
                          {membre.actifYn ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="text-orange-600 bg-orange-600/10">
                          {membre.role}
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
                            <DropdownMenuItem onClick={() => handleViewClick(membre)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(membre)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAssignRoleClick(membre)}
                              
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Assigné un rôle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(membre)}
                              className={cn(
                                membre.actifYn ? "text-red-600" : "text-green-600"
                              )}
                            >
                              {membre.actifYn ? (
                                <>
                                  <BadgeX className="h-4 w-4 mr-2" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <BadgeCheck className="h-4 w-4 mr-2" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(membre)}
                              className="text-red-600"
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Supprimer
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
          {/* Vue en cartes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {membres.map((membre) => (
              <Card key={membre.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                        <AvatarImage src={membre.profilePictureUrl} />
                        <AvatarFallback className="bg-gradient-to-r from-inwi-dark-purple to-inwi-secondary-color text-white">
                          {getInitials(membre.nomPrenom)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                        <CardTitle className="text-lg">{membre.nomPrenom}</CardTitle>
                        <p className="text-sm text-gray-600">{membre.email}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleViewClick(membre)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                          </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(membre)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                          onClick={() => handleToggleStatus(membre)}
                            className={cn(
                            membre.actifYn ? "text-red-600" : "text-green-600"
                          )}
                        >
                          {membre.actifYn ? (
                            <>
                              <BadgeX className="h-4 w-4 mr-2" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <BadgeCheck className="h-4 w-4 mr-2" />
                              Activer
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(membre)}
                          className="text-red-600"
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center space-x-2 mt-3">
                    <Badge className={getStatusColor(membre.actifYn)}>
                      {membre.actifYn ? "Actif" : "Inactif"}
                      </Badge>
                    <Badge className={getTypeColor(membre.interneYn)}>
                      {membre.interneYn ? "Interne" : "Externe"}
                      </Badge>
                      <Badge className="text-orange-600 bg-orange-600/10">
                          {membre.role}
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
                      <span>{membre.telephone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="h-4 w-4 mr-2" />
                      <span className="truncate">{getEntityName(membre.entiteId)}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex flex-col items-center">
                        <Badge className={getFonctionBadgeColor(membre.fonctionId)}>
                          {getFonctionName(membre.fonctionId)}
                        </Badge>
                        <div className="text-xs text-gray-600 mt-1">Fonction</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Badge className={getTypeBadgeColor(membre.typeMembreId)}>
                          {getTypeMembreName(membre.typeMembreId)}
                        </Badge>
                        <div className="text-xs text-gray-600 mt-1">Type</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </TabsContent>
      </Tabs>

      {/* Modale d'ajout */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un membre</DialogTitle>
            <DialogDescription>
              Remplissez les champs pour ajouter un nouveau membre.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div>
              <Label htmlFor="nomPrenom" className="mb-1 block">Nom Prenom</Label>
              <Input
                id="nomPrenom"
                value={formData.nomPrenom}
                onChange={(e) => setFormData({ ...formData, nomPrenom: e.target.value })}
                placeholder="Nom Prenom"
              />
            </div>
            <div>
              <Label htmlFor="photoProfile" className="mb-1 block">Profile Picture</Label>
              <Input
                id="photoProfile"
                value={formData.photoProfile || ''}
                onChange={(e) => setFormData({ ...formData, photoProfile: e.target.value })}
                placeholder="https://"
              />
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label htmlFor="email" className="mb-1 block">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@gmail.com"
                />
              </div>
              <div className="col-span-6">
                <Label htmlFor="password" className="mb-1 block">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="*********"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="telephone" className="mb-1 block">Phone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                placeholder="06*********"
              />
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label htmlFor="typeMembreId" className="mb-1 block">Type Membre</Label>
                <Select
                  value={formData.typeMembreId}
                  onValueChange={(value) => setFormData({ ...formData, typeMembreId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type Membre" />
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
              <div className="col-span-6">
                <Label htmlFor="entiteId" className="mb-1 block">Entite</Label>
                <Select
                  value={formData.entiteId}
                  onValueChange={(value) => setFormData({ ...formData, entiteId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Entite" />
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
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label htmlFor="fonctionId" className="mb-1 block">Fonction</Label>
                <Select
                  value={formData.fonctionId}
                  onValueChange={(value) => setFormData({ ...formData, fonctionId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Fonction" />
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
              <div className="col-span-6">
                <Label htmlFor="role" className="mb-1 block">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 flex items-center justify-between border p-4 rounded-lg">
                <span>Interne</span>
                <Switch
                  checked={formData.interneYn}
                  onCheckedChange={(checked) => setFormData({ ...formData, interneYn: checked })}
                />
              </div>
              <div className="col-span-6 flex items-center justify-between border p-4 rounded-lg">
                <span>Actif</span>
                <Switch
                  checked={formData.actifYn}
                  onCheckedChange={(checked) => setFormData({ ...formData, actifYn: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddMembre}>Submit</Button>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du membre</DialogTitle>
            <DialogDescription>
              Visualisez les informations du membre sélectionné.
            </DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
            <Avatar className="h-20 w-20">
                <AvatarImage src={currentMembre?.profilePictureUrl} />
                <AvatarFallback>
                  {getInitials(currentMembre?.nomPrenom || 'Inconnu')}
                </AvatarFallback>
                  </Avatar>
              {/* <Label className="text-right">Nom Prénom</Label> */}
              <div className="col-span-3">{currentMembre?.nomPrenom}</div>
              </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">ID</Label>
              <div className="col-span-3">{currentMembre?.id}</div>
                </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Email</Label>
              <div className="col-span-3">{currentMembre?.email}</div>
                </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Téléphone</Label>
              <div className="col-span-3">{currentMembre?.telephone}</div>
                </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Rôle</Label>
              <div className="col-span-3">{currentMembre ? getRoleName(currentMembre.role) : ""}</div>
                </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="">Type de membre</Label>
              <div className="col-span-3">{currentMembre ? getTypeMembreName(currentMembre.typeMembreId) : ""}</div>
                </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Entité</Label>
              <div className="col-span-3">{currentMembre ? getEntityName(currentMembre.entiteId) : ""}</div>
                </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Fonction</Label>
              <div className="col-span-3">{currentMembre ? getFonctionName(currentMembre.fonctionId) : ""}</div>
                </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Interne</Label>
              <div className="col-span-3">{currentMembre?.interneYn ? "Oui" : "Non"}</div>
                </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Actif</Label>
              <div className="col-span-3">{currentMembre?.actifYn ? "Oui" : "Non"}</div>
                </div>
                </div>
          <DialogFooter>
            <Button onClick={() => setOpenViewDialog(false)} className="inwi_btn">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le membre</DialogTitle>
            <DialogDescription>
              Modifiez les champs puis cliquez sur "Enregistrer" pour sauvegarder les changements.
            </DialogDescription>
          </DialogHeader>
              <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-nomPrenom" className="text-right">
                Nom Prénom
              </Label>
                    <Input
                id="edit-nomPrenom"
                value={formData.nomPrenom}
                onChange={(e) => setFormData({ ...formData, nomPrenom: e.target.value })}
                className="col-span-3"
                    />
                  </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
                    <Input
                id="edit-email"
                      type="email"
                      value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
                    />
                  </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-telephone" className="text-right">
                Téléphone
              </Label>
                    <Input
                id="edit-telephone"
                      value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="col-span-3"
                    />
                  </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-typeMembreId" className="text-right">
                      Type de membre
                    </Label>
                    <Select
                value={formData.typeMembreId}
                onValueChange={(value) => setFormData({ ...formData, typeMembreId: value })}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-entiteId" className="text-right">
                Entité
              </Label>
                    <Select
                value={formData.entiteId}
                onValueChange={(value) => setFormData({ ...formData, entiteId: value })}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-fonctionId" className="text-right">
                Fonction
              </Label>
                    <Select
                value={formData.fonctionId}
                onValueChange={(value) => setFormData({ ...formData, fonctionId: value })}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-interneYn" className="text-right">
                Interne
              </Label>
              <div className="col-span-3">
                    <Switch
                  id="edit-interneYn"
                  checked={formData.interneYn}
                  onCheckedChange={(checked) => setFormData({ ...formData, interneYn: checked })}
                />
                  </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-actifYn" className="text-right">
                Actif
              </Label>
              <div className="col-span-3">
                    <Switch
                  id="edit-actifYn"
                  checked={formData.actifYn}
                  onCheckedChange={(checked) => setFormData({ ...formData, actifYn: checked })}
                />
                  </div>
                </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Rôle
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-photoProfile" className="text-right">
                  URL Photo de profil
                </Label>
                <Input
                  id="edit-photoProfile"
                  value={formData.photoProfile || ''}
                  onChange={(e) => setFormData({ ...formData, photoProfile: e.target.value })}
                  className="col-span-3"
                  placeholder="https://..."
                />
              </div>
              </div>
              <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit" onClick={handleEditMembre} className="inwi_btn">
                  Enregistrer
                </Button>
              </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le membre</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le membre{" "}
              <span className="font-semibold">{currentMembre?.nomPrenom}</span> ?
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
            <Button variant="destructive" onClick={handleDeleteMembre} className="inwi_btn">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



       {/* Modale d'assignation de rôle */}
       <Dialog open={openAssignRoleDialog} onOpenChange={setOpenAssignRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un rôle</DialogTitle>
            <DialogDescription>
              Assignez un rôle au membre{" "}
              <span className="font-semibold">{currentMembre?.nomPrenom}</span> ?
            </DialogDescription>
          </DialogHeader>
          
            <div>
              <Label htmlFor="assign-role" className="text-right my-3">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
   
          <DialogFooter>
          
            <Button variant="destructive" onClick={handleAssignRole} className="inwi_btn">
              Assigné
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
