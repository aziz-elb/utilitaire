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
import { getFonctions, addFonction, updateFonction, deleteFonction } from "@/services/fonctionService";
import type { Fonction } from "@/services/fonctionService";

export default function FonctionCrud() {
  // État pour la liste des fonctions
  const [fonctions, setFonctions] = useState<Fonction[]>([]);
  const [loading, setLoading] = useState(true);

  // États pour les modales
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentFonction, setCurrentFonction] = useState<Fonction | null>(null);

  // États pour les champs du formulaire
  const [libelle, setLibelle] = useState("");

  // Charger les fonctions au montage du composant
  useEffect(() => {
    fetchFonctions();
  }, []);

  // Récupérer la liste des fonctions
  const fetchFonctions = async () => {
    try {
      setLoading(true);
      const data = await getFonctions();
      setFonctions(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des fonctions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser les champs du formulaire
  const resetForm = () => {
    setLibelle("");
    setCurrentFonction(null);
  };

  // Ouvrir la modale d'ajout
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  // Ouvrir la modale de visualisation
  const handleViewClick = (fonction: Fonction) => {
    setCurrentFonction(fonction);
    setOpenViewDialog(true);
  };

  // Ouvrir la modale d'édition
  const handleEditClick = (fonction: Fonction) => {
    setCurrentFonction(fonction);
    setLibelle(fonction.libelle);
    setOpenEditDialog(true);
  };

  // Ouvrir la modale de suppression
  const handleDeleteClick = (fonction: Fonction) => {
    setCurrentFonction(fonction);
    setOpenDeleteDialog(true);
  };

  // Ajouter une nouvelle fonction
  const handleAddFonction = async () => {
    try {
      const newFonction = await addFonction({
        libelle: libelle.trim(),
      });
      setFonctions([...fonctions, newFonction]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Fonction ajoutée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la fonction");
      console.error(error);
    }
  };

  // Modifier une fonction existante
  const handleEditFonction = async () => {
    if (!currentFonction) return;

    try {
      const updated = await updateFonction({
        fonctionId: currentFonction.fonctionId,
        libelle: libelle.trim(),
      });
      const updatedFonctions = fonctions.map((fonction) =>
        fonction.fonctionId === currentFonction.fonctionId ? updated : fonction
      );
      setFonctions(updatedFonctions);
      setOpenEditDialog(false);
      resetForm();
      toast.success("Fonction modifiée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification de la fonction");
      console.error(error);
    }
  };

  // Supprimer une fonction
  const handleDeleteFonction = async () => {
    if (!currentFonction) return;

    try {
      await deleteFonction(currentFonction.fonctionId);
      const filteredFonctions = fonctions.filter(
        (fonction) => fonction.fonctionId !== currentFonction.fonctionId
      );
      setFonctions(filteredFonctions);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Fonction supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la fonction");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des fonctions</h1>
        <Button onClick={handleAddClick} className="inwi_btn">
          Ajouter <CirclePlus className="ml-2" />
        </Button>
      </div>

      {/* Tableau des fonctions */}
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
            ) : fonctions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Aucune fonction disponible
                </TableCell>
              </TableRow>
            ) : (
              fonctions.map((fonction) => (
                <TableRow key={fonction.fonctionId}>
                  <TableCell>{fonction.fonctionId}</TableCell>
                  <TableCell>{fonction.libelle}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white">
                        <DropdownMenuItem onClick={() => handleViewClick(fonction)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(fonction)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(fonction)}
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
            <DialogTitle>Ajouter une fonction</DialogTitle>
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
                placeholder="Entrez le nom de la fonction"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)} >
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddFonction} className="inwi_btn">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la fonction</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">ID</Label>
              <div className="col-span-3">{currentFonction?.fonctionId}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Libellé</Label>
              <div className="col-span-3">{currentFonction?.libelle}</div>
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
            <DialogTitle>Modifier la fonction</DialogTitle>
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
            <Button variant="outline" onClick={() => setOpenEditDialog(false)} >
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditFonction} className="inwi_btn">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la fonction</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la fonction{" "}
              <span className="font-semibold">{currentFonction?.libelle}</span> ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)} >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteFonction} className="inwi_btn">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}