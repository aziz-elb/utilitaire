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
import axios from "axios";

const API_URL = "http://localhost:8000/role";

type Role = {
  id: string;
  libelle: string;
};

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
  const [libelle, setLibelle] = useState("");

  // Charger les rôles au montage du composant
  useEffect(() => {
    fetchRoles();
  }, []);

  // Récupérer la liste des rôles
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setRoles(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des rôles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser les champs du formulaire
  const resetForm = () => {
    setLibelle("");
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
    setLibelle(role.libelle);
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
      const response = await axios.post(API_URL, {
        libelle: libelle.trim(),
      });
      setRoles([...roles, response.data]);
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
      const response = await axios.put(`${API_URL}/${currentRole.id}`, {
        libelle: libelle.trim(),
      });
      const updatedRoles = roles.map((role) =>
        role.id === currentRole.id ? response.data : role
      );
      setRoles(updatedRoles);
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
      await axios.delete(`${API_URL}/${currentRole.id}`);
      const filteredRoles = roles.filter((role) => role.id !== currentRole.id);
      setRoles(filteredRoles);
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
        <Button onClick={handleAddClick} className="inwiButton">
          Ajouter <CirclePlus className="ml-2" />
        </Button>
      </div>

      {/* Tableau des rôles */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Aucun rôle disponible
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.libelle}</TableCell>
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
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="libelle" className="text-right">
                Libellé
              </Label>
              <Input
                id="libelle"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Chef de projet"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddRole}>
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
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">ID</Label>
              <div className="col-span-3">{currentRole?.id}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Libellé</Label>
              <div className="col-span-3">{currentRole?.libelle}</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenViewDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le rôle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="libelle" className="text-right">
                Libellé
              </Label>
              <Input
                id="libelle"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditRole}>
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
              Êtes-vous sûr de vouloir supprimer le rôle{" "}
              <span className="font-semibold">{currentRole?.libelle}</span> ?
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
            <Button variant="destructive" onClick={handleDeleteRole}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
