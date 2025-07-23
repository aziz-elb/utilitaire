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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
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
  ChevronLeft,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getStatutEtapes,
  addStatutEtape,
  updateStatutEtape,
  deleteStatutEtape,
  type StatutEtape,
  type StatutEtapeInput,
} from "@/services/statutEtapeService";

export default function StatutEtapeCrud() {
  // États principaux
  const [statutsEtape, setStatutsEtape] = useState<StatutEtape[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // États pour les modales
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentStatut, setCurrentStatut] = useState<StatutEtape | null>(null);

  // États pour les champs du formulaire
  const [formData, setFormData] = useState<StatutEtapeInput>({
    libelle: "",
  });

  // Charger les données initiales
  useEffect(() => {
    fetchStatutsEtape();
  }, []);

  const fetchStatutsEtape = async () => {
    try {
      setLoading(true);
      const data = await getStatutEtapes();
      setStatutsEtape(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des statuts d'étape");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      libelle: "",
    });
    setCurrentStatut(null);
  };

  // Gestion des clics
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  const handleViewClick = (statut: StatutEtape) => {
    setCurrentStatut(statut);
    setOpenViewDialog(true);
  };

  const handleEditClick = (statut: StatutEtape) => {
    setCurrentStatut(statut);
    setFormData({
      libelle: statut.libelle,
    });
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (statut: StatutEtape) => {
    setCurrentStatut(statut);
    setOpenDeleteDialog(true);
  };

  // Opérations CRUD
  const handleAddStatut = async () => {
    try {
      const newStatut = await addStatutEtape({
        libelle: formData.libelle.trim(),
      });
      setStatutsEtape([...statutsEtape, newStatut]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Statut d'étape ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du statut d'étape");
      console.error(error);
    }
  };

  const handleEditStatut = async () => {
    if (!currentStatut) return;

    try {
      const updatedStatut = await updateStatutEtape(currentStatut.id, {
        libelle: formData.libelle.trim(),
      });
      const updatedStatuts = statutsEtape.map((t) =>
        t.id === currentStatut.id ? updatedStatut : t
      );
      setStatutsEtape(updatedStatuts);
      setOpenEditDialog(false);
      resetForm();
      toast.success("Statut d'étape modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du statut d'étape");
      console.error(error);
    }
  };

  const handleDeleteStatut = async () => {
    if (!currentStatut) return;

    try {
      await deleteStatutEtape(currentStatut.id);
      const filteredStatuts = statutsEtape.filter((t) => t.id !== currentStatut.id);
      setStatutsEtape(filteredStatuts);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Statut d'étape supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du statut d'étape");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des statuts d'étape</h1>
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
          {/* Tableau des statuts d'étape */}
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
                ) : statutsEtape.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Aucun statut d'étape disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  statutsEtape.map((statut) => (
                    <TableRow key={statut.id}>
                      <TableCell>{statut.id}</TableCell>
                      <TableCell>{statut.libelle}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white">
                            <DropdownMenuItem onClick={() => handleViewClick(statut)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(statut)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(statut)}
                              className="text-red-600"
                            >
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
              <p>Chargement des statuts d'étape...</p>
            </div>
          ) : statutsEtape.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Aucun statut d'étape disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statutsEtape.map((statut) => (
                <Card key={statut.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Statut #{statut.id}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-500">Libellé</Label>
                      <p className="text-sm">{statut.libelle}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClick(statut)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(statut)}
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
            <DialogTitle>Ajouter un statut d'étape</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="libelle">Libellé</Label>
              <Input
                id="libelle"
                value={formData.libelle}
                onChange={(e) =>
                  setFormData({ ...formData, libelle: e.target.value })
                }
                placeholder="Libellé du statut d'étape"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddStatut} className="inwi_btn">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du statut d'étape</DialogTitle>
          </DialogHeader>
          {currentStatut && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">ID</Label>
                  <div>{currentStatut.id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Libellé</Label>
                  <div>{currentStatut.libelle}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setOpenViewDialog(false)} className="bg-inwi-purple/80 hover:bg-inwi-purple inwi_btn">Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le statut d'étape</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="libelle">Libellé</Label>
              <Input
                id="libelle"
                value={formData.libelle}
                onChange={(e) =>
                  setFormData({ ...formData, libelle: e.target.value })
                }
                placeholder="Libellé du statut d'étape"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditStatut} className="inwi_btn">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le statut d'étape</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le statut d'étape{" "}
              <span className="font-semibold">{currentStatut?.libelle}</span> ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteStatut} className="inwi_btn">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}