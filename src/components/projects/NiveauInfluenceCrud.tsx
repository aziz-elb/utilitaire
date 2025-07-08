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
  ChevronLeft,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getNiveauInfluences,
  addNiveauInfluence,
  updateNiveauInfluence,
  deleteNiveauInfluence,
  type NiveauInfluence,
  type NiveauInfluenceInput,
} from "@/services/niveauInfluenceService";

export default function NiveauInfluenceCrud() {
  // États principaux
  const [niveauInfluences, setNiveauInfluences] = useState<NiveauInfluence[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // États pour les modales
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentNiveau, setCurrentNiveau] = useState<NiveauInfluence | null>(null);

  // États pour les champs du formulaire
  const [formData, setFormData] = useState<NiveauInfluenceInput>({
    description: "",
  });

  // Charger les données initiales
  useEffect(() => {
    fetchNiveauInfluences();
  }, []);

  const fetchNiveauInfluences = async () => {
    try {
      setLoading(true);
      const data = await getNiveauInfluences();
      setNiveauInfluences(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des niveaux d'influence");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      description: "",
    });
    setCurrentNiveau(null);
  };

  // Gestion des clics
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  const handleViewClick = (niveau: NiveauInfluence) => {
    setCurrentNiveau(niveau);
    setOpenViewDialog(true);
  };

  const handleEditClick = (niveau: NiveauInfluence) => {
    setCurrentNiveau(niveau);
    setFormData({
      description: niveau.description,
    });
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (niveau: NiveauInfluence) => {
    setCurrentNiveau(niveau);
    setOpenDeleteDialog(true);
  };

  // Opérations CRUD
  const handleAddNiveau = async () => {
    try {
      const newNiveau = await addNiveauInfluence({
        description: formData.description.trim(),
      });
      setNiveauInfluences([...niveauInfluences, newNiveau]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Niveau d'influence ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du niveau d'influence");
      console.error(error);
    }
  };

  const handleEditNiveau = async () => {
    if (!currentNiveau) return;

    try {
      const updatedNiveau = await updateNiveauInfluence(currentNiveau.id, {
        description: formData.description.trim(),
      });
      const updatedNiveaux = niveauInfluences.map((n) =>
        n.id === currentNiveau.id ? updatedNiveau : n
      );
      setNiveauInfluences(updatedNiveaux);
      setOpenEditDialog(false);
      resetForm();
      toast.success("Niveau d'influence modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du niveau d'influence");
      console.error(error);
    }
  };

  const handleDeleteNiveau = async () => {
    if (!currentNiveau) return;

    try {
      await deleteNiveauInfluence(currentNiveau.id);
      const filteredNiveaux = niveauInfluences.filter(
        (n) => n.id !== currentNiveau.id
      );
      setNiveauInfluences(filteredNiveaux);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Niveau d'influence supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du niveau d'influence");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Gestion des niveaux d'influence
        </h1>
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
          {/* Tableau des niveaux d'influence */}
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
                ) : niveauInfluences.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Aucun niveau d'influence disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  niveauInfluences.map((niveau) => (
                    <TableRow key={niveau.id}>
                      <TableCell>{niveau.id}</TableCell>
                      <TableCell>{niveau.description}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white">
                            <DropdownMenuItem
                              onClick={() => handleViewClick(niveau)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClick(niveau)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(niveau)}
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
              <p>Chargement des niveaux d'influence...</p>
            </div>
          ) : niveauInfluences.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Aucun niveau d'influence disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {niveauInfluences.map((niveau) => (
                <Card
                  key={niveau.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle>{niveau.description}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-1">
                      <Label className="text-sm text-gray-500">ID</Label>
                      <p>{niveau.id}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClick(niveau)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(niveau)}
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
            <DialogTitle>Ajouter un niveau d'influence</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Nom du niveau"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddNiveau} className="inwi_btn">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du niveau d'influence</DialogTitle>
          </DialogHeader>
          {currentNiveau && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">ID</Label>
                  <div>{currentNiveau.id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Description</Label>
                  <div>{currentNiveau.description}</div>
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
            <DialogTitle>Modifier le niveau d'influence</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <Input
                id="edit_description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Nom du niveau"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditNiveau} className="inwi_btn">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le niveau d'influence</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le niveau d'influence{" "}
              <span className="font-semibold">{currentNiveau?.description}</span> ?
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
            <Button variant="destructive" onClick={handleDeleteNiveau} className="inwi_btn">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 