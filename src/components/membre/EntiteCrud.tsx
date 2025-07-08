"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { getEntites, addEntite, updateEntite, deleteEntite } from "@/services/entiteService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Entite } from "@/services/entiteService";

export default function EntiteCrud() {
  // État pour la liste des entités
  const [entites, setEntites] = useState<Entite[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // États pour les modales
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentEntite, setCurrentEntite] = useState<Entite | null>(null);

  // États pour les champs du formulaire
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");

  // Charger les entités au montage du composant
  useEffect(() => {
    fetchEntites();
  }, []);

  // Récupérer la liste des entités
  const fetchEntites = async () => {
    try {
      setLoading(true);
      const data = await getEntites();
      setEntites(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des entités");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser les champs du formulaire
  const resetForm = () => {
    setTitre("");
    setDescription("");
    setCurrentEntite(null);
  };

  // Ouvrir la modale d'ajout
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  // Ouvrir la modale de visualisation
  const handleViewClick = (entite: Entite) => {
    setCurrentEntite(entite);
    setOpenViewDialog(true);
  };

  // Ouvrir la modale d'édition
  const handleEditClick = (entite: Entite) => {
    setCurrentEntite(entite);
    setTitre(entite.titre);
    setDescription(entite.description);
    setOpenEditDialog(true);
  };

  // Ouvrir la modale de suppression
  const handleDeleteClick = (entite: Entite) => {
    setCurrentEntite(entite);
    setOpenDeleteDialog(true);
  };

  // Ajouter une nouvelle entité
  const handleAddEntite = async () => {
    try {
      const newEntite = await addEntite({
        titre: titre.trim(),
        description: description.trim(),
      });
      setEntites([...entites, newEntite]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Entité ajoutée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'entité");
      console.error(error);
    }
  };

  // Modifier une entité existante
  const handleEditEntite = async () => {
    if (!currentEntite) return;

    try {
      const updated = await updateEntite({
        entiteId: currentEntite.entiteId,
        titre: titre.trim(),
        description: description.trim(),
      });
      const updatedEntites = entites.map((entite) =>
        entite.entiteId === currentEntite.entiteId ? updated : entite
      );
      setEntites(updatedEntites);
      setOpenEditDialog(false);
      resetForm();
      toast.success("Entité modifiée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification de l'entité");
      console.error(error);
    }
  };

  // Supprimer une entité
  const handleDeleteEntite = async () => {
    if (!currentEntite) return;

    try {
      await deleteEntite(currentEntite.entiteId);
      const filteredEntites = entites.filter(
        (entite) => entite.entiteId !== currentEntite.entiteId
      );
      setEntites(filteredEntites);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Entité supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'entité");
      console.error(error);
    }
  };

  // Fonction pour tronquer le texte
  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des entités</h1>
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
          {/* Tableau des entités */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Titre</TableHead>
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
                ) : entites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Aucune entité disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  entites.map((entite) => (
                    <TableRow key={entite.entiteId}>
                      <TableCell>{entite.entiteId}</TableCell>
                      <TableCell>{entite.titre}</TableCell>
                      <TableCell>
                        {truncateText(entite.description, 50)}
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
                              onClick={() => handleViewClick(entite)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClick(entite)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(entite)}
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
          {/* Affichage en cartes */}
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Chargement des entités...</p>
            </div>
          ) : entites.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Aucune entité disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entites.map((entite) => (
                <Card
                  key={entite.entiteId}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{entite.titre}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleViewClick(entite)}
                          >
                            <Eye className="h-4 w-4 mr-2" /> Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditClick(entite)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(entite)}
                          >
                            <Archive className="h-4 w-4 mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        {truncateText(entite.description, 100)}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Badge variant="secondary">ID: {entite.entiteId}</Badge>
                      </div>
                    </div>
                  </CardContent>
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
            <DialogTitle>Ajouter une entité</DialogTitle>
            <DialogDescription>
              Remplissez les champs pour ajouter une nouvelle entité.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="titre" className="text-right">
                Titre
              </Label>
              <Input
                id="titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                className="col-span-3"
                placeholder="Entrez le titre"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Entrez la description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)} >
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddEntite} className="inwi_btn">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de l'entité</DialogTitle>
            <DialogDescription>
              Visualisez les informations de l'entité sélectionnée.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">ID</Label>
              <div className="col-span-3">{currentEntite?.entiteId}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Titre</Label>
              <div className="col-span-3">{currentEntite?.titre}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Description</Label>
              <div className="col-span-3">{currentEntite?.description}</div>
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
            <DialogTitle>Modifier l'entité</DialogTitle>
            <DialogDescription>
              Modifiez les champs puis cliquez sur "Enregistrer" pour sauvegarder les changements.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="titre" className="text-right">
                Titre
              </Label>
              <Input
                id="titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
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
            <Button type="submit" onClick={handleEditEntite} className="inwi_btn">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'entité</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'entité{" "}
              <span className="font-semibold">{currentEntite?.titre}</span> ?
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
            <Button  onClick={handleDeleteEntite} className="inwi_btn">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
