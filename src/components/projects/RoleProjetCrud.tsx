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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Archive,
  Edit,
  Eye,
  MoreHorizontal,
  CirclePlus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getRoleProjets,
  addRoleProjet,
  updateRoleProjet,
  deleteRoleProjet,
  type RoleProjet,
} from "@/services/roleProjetService";

export default function RoleProjetCrud() {
  const [roleProjets, setRoleProjets] = useState<RoleProjet[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Modals
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentRoleProjet, setCurrentRoleProjet] = useState<RoleProjet | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<RoleProjet, "id">>({
    libelle: "",
  });

  useEffect(() => {
    fetchRoleProjets();
  }, []);

  const fetchRoleProjets = async () => {
    try {
      setLoading(true);
      const data = await getRoleProjets();
      setRoleProjets(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des rôles de projet");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      libelle: "",
    });
    setCurrentRoleProjet(null);
  };

  // Modal handlers
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };
  const handleViewClick = (roleProjet: RoleProjet) => {
    setCurrentRoleProjet(roleProjet);
    setOpenViewDialog(true);
  };
  const handleEditClick = (roleProjet: RoleProjet) => {
    setCurrentRoleProjet(roleProjet);
    setFormData({
      libelle: roleProjet.libelle,
    });
    setOpenEditDialog(true);
  };
  const handleDeleteClick = (roleProjet: RoleProjet) => {
    setCurrentRoleProjet(roleProjet);
    setOpenDeleteDialog(true);
  };

  // CRUD
  const handleAddRoleProjet = async () => {
    try {
      const newRoleProjet = await addRoleProjet({
        libelle: formData.libelle.trim(),
      });
      setRoleProjets([...roleProjets, newRoleProjet]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Rôle de projet ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du rôle de projet");
      console.error(error);
    }
  };

  const handleEditRoleProjet = async () => {
    if (!currentRoleProjet) return;
    try {
      const updatedRoleProjet = await updateRoleProjet(currentRoleProjet.id, {
        libelle: formData.libelle.trim(),
      });
      const updatedList = roleProjets.map((r) =>
        r.id === currentRoleProjet.id ? updatedRoleProjet : r
      );
      setRoleProjets(updatedList);
      setOpenEditDialog(false);
      resetForm();
      toast.success("Rôle de projet modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du rôle de projet");
      console.error(error);
    }
  };

  const handleDeleteRoleProjet = async () => {
    if (!currentRoleProjet) return;
    try {
      await deleteRoleProjet(currentRoleProjet.id);
      const filtered = roleProjets.filter((r) => r.id !== currentRoleProjet.id);
      setRoleProjets(filtered);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Rôle de projet supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du rôle de projet");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des rôles de projet</h1>
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
            <Eye className="h-4 w-4 mr-2" /> Vue Cartes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          {/* Tableau des rôles de projet */}
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
                ) : roleProjets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Aucun rôle de projet disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  roleProjets.map((roleProjet) => (
                    <TableRow key={roleProjet.id}>
                      <TableCell>{roleProjet.id}</TableCell>
                      <TableCell>{roleProjet.libelle}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white">
                            <DropdownMenuItem onClick={() => handleViewClick(roleProjet)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(roleProjet)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(roleProjet)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
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
          {/* Affichage en cartes */}
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Chargement des rôles de projet...</p>
            </div>
          ) : roleProjets.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Aucun rôle de projet disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roleProjets.map((roleProjet) => (
                <Card
                  key={roleProjet.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle>{roleProjet.libelle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-1">
                      <Label className="text-sm text-gray-500">ID</Label>
                      <p>{roleProjet.id}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClick(roleProjet)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(roleProjet)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Modifier
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Modale d'ajout */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un rôle de projet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="libelle">Libellé</Label>
              <Input
                id="libelle"
                value={formData.libelle}
                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                placeholder="Nom du rôle"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddRoleProjet} className="inwi_btn">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du rôle de projet</DialogTitle>
          </DialogHeader>
          {currentRoleProjet && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">ID</Label>
                  <div>{currentRoleProjet.id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Libellé</Label>
                  <div>{currentRoleProjet.libelle}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setOpenViewDialog(false)} className="inwi_btn">Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le rôle de projet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_libelle">Libellé</Label>
              <Input
                id="edit_libelle"
                value={formData.libelle}
                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                placeholder="Nom du rôle"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditRoleProjet} className="inwi_btn">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le rôle de projet</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le rôle de projet {" "}
              <span className="font-semibold">{currentRoleProjet?.libelle}</span> ?
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
            <Button variant="destructive" onClick={handleDeleteRoleProjet} className="inwi_btn">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 