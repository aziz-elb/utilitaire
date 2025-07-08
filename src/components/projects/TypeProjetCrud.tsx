"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  CheckCircle,
  Trash2,
  Save,
  ChevronLeft,
  Shield,
  ShieldMinus,
  ShieldCheck,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";

const API_URL = "http://localhost:8000/type_projet";

type TypeProjet = {
  id: string;
  libelle: string;
  description: string;
  actif_yn: boolean;
};

export default function TypeProjetCrud() {
  // États principaux
  const [typesProjet, setTypesProjet] = useState<TypeProjet[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // États pour les modales
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentTypeProjet, setCurrentTypeProjet] = useState<TypeProjet | null>(
    null
  );

  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    libelle: "",
    description: "",
    actif_yn: true,
  });

  // Charger les données initiales
  useEffect(() => {
    fetchTypesProjet();
  }, []);

  const fetchTypesProjet = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTypesProjet(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des types de projet");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      libelle: "",
      description: "",
      actif_yn: true,
    });
    setCurrentTypeProjet(null);
  };

  // Gestion des clics
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  const handleViewClick = (typeProjet: TypeProjet) => {
    setCurrentTypeProjet(typeProjet);
    setOpenViewDialog(true);
  };

  const handleEditClick = (typeProjet: TypeProjet) => {
    setCurrentTypeProjet(typeProjet);
    setFormData({
      libelle: typeProjet.libelle,
      description: typeProjet.description,
      actif_yn: typeProjet.actif_yn,
    });
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (typeProjet: TypeProjet) => {
    setCurrentTypeProjet(typeProjet);
    setOpenDeleteDialog(true);
  };

  // Opérations CRUD
  const handleAddTypeProjet = async () => {
    try {
      const newTypeProjet = {
        ...formData,
        libelle: formData.libelle.toLowerCase().trim(),
        description: formData.description.toLowerCase().trim(),
      };

      const response = await axios.post(API_URL, newTypeProjet);
      setTypesProjet([...typesProjet, response.data]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Type de projet ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du type de projet");
      console.error(error);
    }
  };

  const handleEditTypeProjet = async () => {
    if (!currentTypeProjet) return;

    try {
      const updatedTypeProjet = {
        ...formData,
        libelle: formData.libelle.toLowerCase().trim(),
        description: formData.description.toLowerCase().trim(),
      };

      const response = await axios.put(
        `${API_URL}/${currentTypeProjet.id}`,
        updatedTypeProjet
      );
      const updatedTypesProjet = typesProjet.map((t) =>
        t.id === currentTypeProjet.id ? response.data : t
      );
      setTypesProjet(updatedTypesProjet);
      setOpenEditDialog(false);
      resetForm();
      toast.success("Type de projet modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du type de projet");
      console.error(error);
    }
  };

  const handleDeleteTypeProjet = async () => {
    if (!currentTypeProjet) return;

    try {
      await axios.delete(`${API_URL}/${currentTypeProjet.id}`);
      const filteredTypesProjet = typesProjet.filter(
        (t) => t.id !== currentTypeProjet.id
      );
      setTypesProjet(filteredTypesProjet);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Type de projet supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du type de projet");
      console.error(error);
    }
  };

  // Fonction pour activer/désactiver un type de projet
  const handleToggleStatus = async (typeProjet: TypeProjet) => {
    try {
      const newStatus = !typeProjet.actif_yn;
      const response = await axios.patch(`${API_URL}/${typeProjet.id}`, {
        actif_yn: newStatus,
      });

      setTypesProjet(
        typesProjet.map((t) =>
          t.id === typeProjet.id ? { ...t, actif_yn: newStatus } : t
        )
      );

      toast.success(
        newStatus ? "Type activé avec succès" : "Type désactivé avec succès"
      );
    } catch (error) {
      toast.error(
        `Erreur lors de ${
          typeProjet.actif_yn ? "la désactivation" : "l'activation"
        } du type`
      );
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des types de projet</h1>
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
          {/* Tableau des types de projet */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : typesProjet.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Aucun type de projet disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  typesProjet.map((typeProjet) => (
                    <TableRow key={typeProjet.id}>
                      <TableCell>{typeProjet.id}</TableCell>
                      <TableCell>{typeProjet.libelle}</TableCell>
                      <TableCell className="truncate max-w-xs">
                        {typeProjet.description || "Aucune description"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={typeProjet.actif_yn ? "default" : "outline"}
                          className={
                            typeProjet.actif_yn
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }
                        >
                          {typeProjet.actif_yn ? "Actif" : "Inactif"}
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
                            <DropdownMenuItem
                              onClick={() => handleViewClick(typeProjet)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClick(typeProjet)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(typeProjet)}
                              className="text-red-600"
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={cn(
                                typeProjet.actif_yn
                                  ? "text-red-500"
                                  : "text-green-500"
                              )}
                              onClick={() => handleToggleStatus(typeProjet)}
                            >
                              {typeProjet.actif_yn ? (
                                <ShieldMinus />
                              ) : (
                                <ShieldCheck />
                              )}

                              {typeProjet.actif_yn ? "Désactiver" : "Activer"}
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
              <p>Chargement des types de projet...</p>
            </div>
          ) : typesProjet.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Aucun type de projet disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typesProjet.map((typeProjet) => (
                <Card
                  key={typeProjet.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{typeProjet.libelle}</CardTitle>
                      <Badge
                        variant={typeProjet.actif_yn ? "default" : "outline"}
                        className={
                          typeProjet.actif_yn
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }
                      >
                        {typeProjet.actif_yn ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-500">
                        Description
                      </Label>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {typeProjet.description || "Aucune description"}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClick(typeProjet)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(typeProjet)}
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
            <DialogTitle>Ajouter un type de projet</DialogTitle>
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
                placeholder="Nom du type"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description du type"
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="actif"
                checked={formData.actif_yn}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, actif_yn: checked })
                }
              />
              <Label htmlFor="actif">Actif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              onClick={handleAddTypeProjet}
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du type de projet</DialogTitle>
          </DialogHeader>
          {currentTypeProjet && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">ID</Label>
                  <div>{currentTypeProjet.id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Libellé</Label>
                  <div>{currentTypeProjet.libelle}</div>
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-gray-500">Description</Label>
                  <div>
                    {currentTypeProjet.description || "Aucune description"}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Statut</Label>
                  <div>{currentTypeProjet.actif_yn ? "Actif" : "Inactif"}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setOpenViewDialog(false)}
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le type de projet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_libelle">Libellé</Label>
              <Input
                id="edit_libelle"
                value={formData.libelle}
                onChange={(e) =>
                  setFormData({ ...formData, libelle: e.target.value })
                }
                placeholder="Nom du type"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description du type"
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="edit_actif"
                checked={formData.actif_yn}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, actif_yn: checked })
                }
              />
              <Label htmlFor="edit_actif">Actif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              onClick={handleEditTypeProjet}
              className="bg-inwi-purple/80 hover:bg-inwi-purple"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le type de projet</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le type de projet{" "}
              <span className="font-semibold">
                {currentTypeProjet?.libelle}
              </span>{" "}
              ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteTypeProjet}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
