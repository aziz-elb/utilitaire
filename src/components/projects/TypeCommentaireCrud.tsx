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
import axios from "axios";
import { cn } from "@/lib/utils";

const API_URL = "http://localhost:8000/type_commentaire";

type TypeCommentaire = {
  id: string;
  description: string;
};

export default function TypeCommentaireCrud() {
  // États principaux
  const [typesCommentaire, setTypesCommentaire] = useState<TypeCommentaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // États pour les modales
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentType, setCurrentType] = useState<TypeCommentaire | null>(null);

  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    description: "",
  });

  // Charger les données initiales
  useEffect(() => {
    fetchTypesCommentaire();
  }, []);

  const fetchTypesCommentaire = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTypesCommentaire(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des types de commentaire");
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
    setCurrentType(null);
  };

  // Gestion des clics
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  const handleViewClick = (type: TypeCommentaire) => {
    setCurrentType(type);
    setOpenViewDialog(true);
  };

  const handleEditClick = (type: TypeCommentaire) => {
    setCurrentType(type);
    setFormData({
      description: type.description,
    });
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (type: TypeCommentaire) => {
    setCurrentType(type);
    setOpenDeleteDialog(true);
  };

  // Opérations CRUD
  const handleAddType = async () => {
    try {
      const newType = {
        description: formData.description.toLowerCase().trim(),
      };

      const response = await axios.post(API_URL, newType);
      setTypesCommentaire([...typesCommentaire, response.data]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Type de commentaire ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du type de commentaire");
      console.error(error);
    }
  };

  const handleEditType = async () => {
    if (!currentType) return;

    try {
      const updatedType = {
        description: formData.description.toLowerCase().trim(),
      };

      const response = await axios.put(`${API_URL}/${currentType.id}`, updatedType);
      const updatedTypes = typesCommentaire.map((t) =>
        t.id === currentType.id ? response.data : t
      );
      setTypesCommentaire(updatedTypes);
      setOpenEditDialog(false);
      resetForm();
      toast.success("Type de commentaire modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du type de commentaire");
      console.error(error);
    }
  };

  const handleDeleteType = async () => {
    if (!currentType) return;

    try {
      await axios.delete(`${API_URL}/${currentType.id}`);
      const filteredTypes = typesCommentaire.filter((t) => t.id !== currentType.id);
      setTypesCommentaire(filteredTypes);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Type de commentaire supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du type de commentaire");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des types de commentaire</h1>
        <Button onClick={handleAddClick} className="bg-inwi-purple/80 hover:bg-inwi-purple">
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
          {/* Tableau des types de commentaire */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Description</TableHead>
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
                ) : typesCommentaire.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Aucun type de commentaire disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  typesCommentaire.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>{type.id}</TableCell>
                      <TableCell>{type.description}</TableCell>
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
              <p>Chargement des types de commentaire...</p>
            </div>
          ) : typesCommentaire.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Aucun type de commentaire disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typesCommentaire.map((type) => (
                <Card key={type.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Type #{type.id}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-500">Description</Label>
                      <p className="text-sm">{type.description}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClick(type)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(type)}
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
            <DialogTitle>Ajouter un type de commentaire</DialogTitle>
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
                placeholder="Description du type de commentaire"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddType}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du type de commentaire</DialogTitle>
          </DialogHeader>
          {currentType && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">ID</Label>
                  <div>{currentType.id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Description</Label>
                  <div>{currentType.description}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setOpenViewDialog(false)} className="bg-inwi-purple/80 hover:bg-inwi-purple">Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le type de commentaire</DialogTitle>
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
                placeholder="Description du type de commentaire"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditType} className="bg-inwi-purple/80 hover:bg-inwi-purple">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le type de commentaire</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le type de commentaire{" "}
              <span className="font-semibold">{currentType?.description}</span> ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteType}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}