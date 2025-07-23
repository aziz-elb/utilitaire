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
  Edit,
  Eye,
  MoreHorizontal,
  CirclePlus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getTypeCommentaires,
  addTypeCommentaire,
  updateTypeCommentaire,
  deleteTypeCommentaire,
  type TypeCommentaire,
} from "@/services/typeCommentaireService";

export default function TypeCommentaireCrud() {
  const [typeCommentaires, setTypeCommentaires] = useState<TypeCommentaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Modals
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentType, setCurrentType] = useState<TypeCommentaire | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<TypeCommentaire, "id">>({
    description: "",
  });

  useEffect(() => {
    fetchTypeCommentaires();
  }, []);

  const fetchTypeCommentaires = async () => {
    try {
      setLoading(true);
      const data = await getTypeCommentaires();
      setTypeCommentaires(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des types de commentaire");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
    });
    setCurrentType(null);
  };

  // Modal handlers
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

  // CRUD
  const handleAddType = async () => {
    try {
      const newType = await addTypeCommentaire({
        description: formData.description.trim(),
      });
      setTypeCommentaires([...typeCommentaires, newType]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Type commentaire ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du type commentaire");
      console.error(error);
    }
  };

  const handleEditType = async () => {
    if (!currentType) return;
    try {
      const updatedType = await updateTypeCommentaire(currentType.id, {
        description: formData.description.trim(),
      });
      const updatedList = typeCommentaires.map((t) =>
        t.id === currentType.id ? updatedType : t
      );
      setTypeCommentaires(updatedList);
      setOpenEditDialog(false);
      resetForm();
      toast.success("Type commentaire modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du type commentaire");
      console.error(error);
    }
  };

  const handleDeleteType = async () => {
    if (!currentType) return;
    try {
      await deleteTypeCommentaire(currentType.id);
      const filtered = typeCommentaires.filter((t) => t.id !== currentType.id);
      setTypeCommentaires(filtered);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Type commentaire supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du type commentaire");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des types de commentaire</h1>
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
                ) : typeCommentaires.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Aucun type commentaire disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  typeCommentaires.map((type) => (
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
                            <DropdownMenuItem onClick={() => handleDeleteClick(type)} className="text-red-600">
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
          ) : typeCommentaires.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Aucun type commentaire disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typeCommentaires.map((type) => (
                <Card
                  key={type.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle>{type.description}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-1">
                      <Label className="text-sm text-gray-500">ID</Label>
                      <p>{type.id}</p>
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
            <DialogTitle>Ajouter un type commentaire</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du type"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddType} className="inwi_btn">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du type commentaire</DialogTitle>
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
            <Button onClick={() => setOpenViewDialog(false)} className="inwi_btn">Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le type commentaire</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <Input
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du type"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditType} className="inwi_btn">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le type commentaire</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le type commentaire {" "}
              <span className="font-semibold">{currentType?.description}</span> ?
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
            <Button variant="destructive" onClick={handleDeleteType} className="inwi_btn">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}