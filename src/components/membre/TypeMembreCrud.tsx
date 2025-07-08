"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { getTypeMembres, addTypeMembre, updateTypeMembre, deleteTypeMembre } from "@/services/typeMembreService";
import type { TypeMembre } from "@/services/typeMembreService";
import { cn } from "@/lib/utils";

export default function TypeMembreCrud() {
  // État pour la liste des types de membre
  const [typesMembre, setTypesMembre] = useState<TypeMembre[]>([]);
  const [loading, setLoading] = useState(true);

  // États pour les modales
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentTypeMembre, setCurrentTypeMembre] = useState<TypeMembre | null>(null);

  // États pour les champs du formulaire
  const [libelle, setLibelle] = useState("");
  const [obligatoire, setObligatoire] = useState(false);

  // Charger les types de membre au montage du composant
  useEffect(() => {
    fetchTypesMembre();
  }, []);

  // Récupérer la liste des types de membre
  const fetchTypesMembre = async () => {
    try {
      setLoading(true);
      const data = await getTypeMembres();
      setTypesMembre(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des types de membre");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser les champs du formulaire
  const resetForm = () => {
    setLibelle("");
    setObligatoire(false);
    setCurrentTypeMembre(null);
  };

  // Ouvrir la modale d'ajout
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  // Ouvrir la modale de visualisation
  const handleViewClick = (typeMembre: TypeMembre) => {
    setCurrentTypeMembre(typeMembre);
    setOpenViewDialog(true);
  };

  // Ouvrir la modale d'édition
  const handleEditClick = (typeMembre: TypeMembre) => {
    setCurrentTypeMembre(typeMembre);
    setLibelle(typeMembre.libelle);
    setObligatoire(typeMembre.obligatoireYn);
    setOpenEditDialog(true);
  };

  // Ouvrir la modale de suppression
  const handleDeleteClick = (typeMembre: TypeMembre) => {
    setCurrentTypeMembre(typeMembre);
    setOpenDeleteDialog(true);
  };

  // Ajouter un nouveau type de membre
  const handleAddTypeMembre = async () => {
    try {
      const newTypeMembre = await addTypeMembre({
        libelle: libelle.trim(),
        obligatoireYn: obligatoire,
      });
      setTypesMembre([...typesMembre, newTypeMembre]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Type de membre ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du type de membre");
      console.error(error);
    }
  };

  // Modifier un type de membre existant
  const handleEditTypeMembre = async () => {
    if (!currentTypeMembre) return;

    try {
      const updated = await updateTypeMembre({
        typeMembreId: currentTypeMembre.typeMembreId,
        libelle: libelle.trim(),
        obligatoireYn: obligatoire,
      });
      const updatedTypesMembre = typesMembre.map((type) =>
        type.typeMembreId === currentTypeMembre.typeMembreId ? updated : type
      );
      setTypesMembre(updatedTypesMembre);
      setOpenEditDialog(false);
      resetForm();
      toast.success("Type de membre modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du type de membre");
      console.error(error);
    }
  };

  // Supprimer un type de membre
  const handleDeleteTypeMembre = async () => {
    if (!currentTypeMembre) return;

    try {
      await deleteTypeMembre(currentTypeMembre.typeMembreId);
      const filteredTypesMembre = typesMembre.filter(
        (type) => type.typeMembreId !== currentTypeMembre.typeMembreId
      );
      setTypesMembre(filteredTypesMembre);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Type de membre supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du type de membre");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des types de membre</h1>
        <Button onClick={handleAddClick} className="inwi_btn">
          Ajouter <CirclePlus className="ml-2" />
        </Button>
      </div>

      {/* Tableau des types de membre */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead>Obligatoire</TableHead>
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
            ) : typesMembre.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Aucun type de membre disponible
                </TableCell>
              </TableRow>
            ) : (
              typesMembre.map((type) => (
                <TableRow key={type.typeMembreId}>
                  <TableCell>{type.typeMembreId}</TableCell>
                  <TableCell>{type.libelle}</TableCell>
                  <TableCell>
                    <Badge className={type.obligatoireYn ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {type.obligatoireYn ? "Oui" : "Non"}
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
                        <DropdownMenuItem onClick={() => handleViewClick(type)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(type)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(type)}
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
            <DialogTitle>Ajouter un type de membre</DialogTitle>
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
                placeholder="Entrez le libellé"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="obligatoire" className="text-right">
                Obligatoire
              </Label>
              <div className="col-span-3">
                <Switch
                  id="obligatoire"
                  checked={obligatoire}
                  onCheckedChange={setObligatoire}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddTypeMembre}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du type de membre</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">ID</Label>
              <div className="col-span-3">{currentTypeMembre?.typeMembreId}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Libellé</Label>
              <div className="col-span-3">{currentTypeMembre?.libelle}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Obligatoire</Label>
              <div className="col-span-3">
                <Badge variant={currentTypeMembre?.obligatoireYn ? "default" : "outline"}>
                  {currentTypeMembre?.obligatoireYn ? "Oui" : "Non"}
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenViewDialog(false)} className="inwi_btn">Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le type de membre</DialogTitle>
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="obligatoire" className="text-right">
                Obligatoire
              </Label>
              <div className="col-span-3">
                <Switch
                  id="obligatoire"
                  checked={obligatoire}
                  onCheckedChange={setObligatoire}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditTypeMembre} className="inwi_btn">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le type de membre</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le type de membre{" "}
              <span className="font-semibold">{currentTypeMembre?.libelle}</span> ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Annuler
            </Button>
            <Button className="inwi_btn" onClick={handleDeleteTypeMembre}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}