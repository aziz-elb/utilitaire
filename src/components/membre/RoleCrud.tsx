"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Archive, Edit, Eye, MoreHorizontal, CirclePlus } from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  getRoles,
  addRole,
  updateRole,
  deleteRole,
  type Role as ServiceRole,
  type RoleInput,
} from "@/services/roleService";

// Use the Role type from the service
// type Role = {
//   id: string;
//   libelle: string;
// };
type Role = ServiceRole;

export default function RoleCrud() {
  // État pour la liste des rôles
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // États pour les modales
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  // États pour les champs du formulaire
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Charger les rôles au montage du composant
  useEffect(() => {
    fetchRolesList();
  }, []);

  // Récupérer la liste des rôles
  const fetchRolesList = async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des rôles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser les champs du formulaire
  const resetForm = () => {
    setName("");
    setDescription("");
    setCurrentRole(null);
  };

  // Ouvrir la modale d'ajout
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  // Ouvrir la modale de visualisation
  const handleViewClick = (role: Role) => {
    setCurrentRole(role);
    setOpenViewDialog(true);
  };

  // Ouvrir la modale d'édition
  const handleEditClick = (role: Role) => {
    setCurrentRole(role);
    setName(role.name);
    setDescription(role.description);
    setOpenEditDialog(true);
  };

  // Ouvrir la modale de suppression
  const handleDeleteClick = (role: Role) => {
    setCurrentRole(role);
    setOpenDeleteDialog(true);
  };

  // Ajouter un nouveau rôle
  const handleAddRole = async () => {
    try {
      await addRole({ name: name.trim(), description: description.trim() });
      await fetchRolesList();
      setOpenAddDialog(false);
      resetForm();
      toast.success("Rôle ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du rôle");
      console.error(error);
    }
  };

  // Modifier un rôle existant
  const handleEditRole = async () => {
    if (!currentRole) return;
    try {
      await updateRole(currentRole.name, { name: name.trim(), description: description.trim() });
      await fetchRolesList();
      setOpenEditDialog(false);
      resetForm();
      toast.success("Rôle modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du rôle");
      console.error(error);
    }
  };

  // Supprimer un rôle
  const handleDeleteRole = async () => {
    if (!currentRole) return;
    try {
      await deleteRole(currentRole.name);
      await fetchRolesList();
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Rôle supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du rôle");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des rôles</h1>
        <Button onClick={handleAddClick} className="inwi_btn">
          Ajouter <CirclePlus className="ml-2" />
        </Button>
      </div>

      {/* Tableau des rôles */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Aucun rôle disponible
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white">
                        <DropdownMenuItem onClick={() => handleViewClick(role)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(role)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(role)}
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

      {/* Modale d'ajout */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un rôle</DialogTitle>
            <DialogDescription>
              Remplissez les champs pour ajouter un nouveau rôle.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: manager"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Responsable de projet"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)} >
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddRole} className="inwi_btn">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du rôle</DialogTitle>
            <DialogDescription>
              Visualisez les informations du rôle sélectionné.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">ID</Label>
              <div className="col-span-3">{currentRole?.id}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Nom</Label>
              <div className="col-span-3">{currentRole?.name}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Description</Label>
              <div className="col-span-3">{currentRole?.description}</div>
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
            <DialogTitle>Modifier le rôle</DialogTitle>
            <DialogDescription>
              Modifiez les champs puis cliquez sur "Enregistrer" pour sauvegarder les changements.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)} >
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditRole} className="inwi_btn">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le rôle</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le rôle {" "}
              <span className="font-semibold">{currentRole?.name}</span> ?
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
            <Button variant="destructive" onClick={handleDeleteRole} className="inwi_btn">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
