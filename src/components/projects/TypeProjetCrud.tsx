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
  getTypeProjets,
  addTypeProjet,
  updateTypeProjet,
  deleteTypeProjet,
  type TypeProjet,
} from "@/services/typeProjetService";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function TypeProjetCrud() {
  const [typeProjets, setTypeProjets] = useState<TypeProjet[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Modals
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentTypeProjet, setCurrentTypeProjet] = useState<TypeProjet | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<TypeProjet, "id">>({
    libelle: "",
    description: "",
    actifYn: true,
  });

  useEffect(() => {
    fetchTypeProjets();
  }, []);

  const fetchTypeProjets = async () => {
    try {
      setLoading(true);
      const data = await getTypeProjets();
      setTypeProjets(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des types de projet");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      libelle: "",
      description: "",
      actifYn: true,
    });
    setCurrentTypeProjet(null);
  };

  // Modal handlers
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
      actifYn: typeProjet.actifYn,
    });
    setOpenEditDialog(true);
  };
  const handleDeleteClick = (typeProjet: TypeProjet) => {
    setCurrentTypeProjet(typeProjet);
    setOpenDeleteDialog(true);
  };

  // CRUD
  const handleAddTypeProjet = async () => {
    try {
      const newTypeProjet = await addTypeProjet({
        libelle: formData.libelle.trim(),
        description: formData.description.trim(),
        actifYn: formData.actifYn,
      });
      setTypeProjets([...typeProjets, newTypeProjet]);
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
      const updatedTypeProjet = await updateTypeProjet(currentTypeProjet.id, {
        libelle: formData.libelle.trim(),
        description: formData.description.trim(),
        actifYn: formData.actifYn,
      });
      const updatedList = typeProjets.map((t) =>
        t.id === currentTypeProjet.id ? updatedTypeProjet : t
      );
      setTypeProjets(updatedList);
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
      await deleteTypeProjet(currentTypeProjet.id);
      const filtered = typeProjets.filter((t) => t.id !== currentTypeProjet.id);
      setTypeProjets(filtered);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Type de projet supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du type de projet");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
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
                  <TableHead>Actif</TableHead>
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
                ) : typeProjets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Aucun type de projet disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  typeProjets.map((typeProjet) => (
                    <TableRow key={typeProjet.id}>
                      <TableCell>{typeProjet.id}</TableCell>
                      <TableCell>{typeProjet.libelle}</TableCell>
                      <TableCell>{typeProjet.description}</TableCell>
                      <TableCell >
                        <Badge className={`${typeProjet.actifYn ? "text-green-600 bg-green-600/10" : "text-red-600 bg-red-600/10"}`}>
                        {typeProjet.actifYn ? "Oui" : "Non"}
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
                            <DropdownMenuItem onClick={() => handleViewClick(typeProjet)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(typeProjet)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(typeProjet)} className="text-red-600">
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
              <p>Chargement des types de projet...</p>
            </div>
          ) : typeProjets.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Aucun type de projet disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typeProjets.map((typeProjet) => (
                <Card
                  key={typeProjet.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle>{typeProjet.libelle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-1">
                      <Label className="text-sm text-gray-500">ID</Label>
                      <p>{typeProjet.id}</p>
                      <Label className="text-sm text-gray-500 mt-2">Description</Label>
                      <p>{typeProjet.description}</p>
                      <Label className="text-sm text-gray-500 mt-2">Actif</Label>
                      <p>{typeProjet.actifYn ? "Oui" : "Non"}</p>
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
                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                placeholder="Nom du type"
                required
              />
            </div>
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
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="actifYn"
                checked={formData.actifYn}
                onCheckedChange={(checked) => setFormData({ ...formData, actifYn: checked })}
              />
              <Label htmlFor="actifYn">Actif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddTypeProjet} className="inwi_btn">
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
                  <div>{currentTypeProjet.description}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Actif</Label>
                  <div>{currentTypeProjet.actifYn ? "Oui" : "Non"}</div>
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
            <DialogTitle>Modifier le type de projet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_libelle">Libellé</Label>
              <Input
                id="edit_libelle"
                value={formData.libelle}
                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                placeholder="Nom du type"
                required
              />
            </div>
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
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="edit_actifYn"
                checked={formData.actifYn}
                onCheckedChange={(checked) => setFormData({ ...formData, actifYn: checked })}
              />
              <Label htmlFor="edit_actifYn">Actif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditTypeProjet} className="inwi_btn">
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
              Êtes-vous sûr de vouloir supprimer le type de projet {" "}
              <span className="font-semibold">{currentTypeProjet?.libelle}</span> ?
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
            <Button variant="destructive" onClick={handleDeleteTypeProjet} className="inwi_btn">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
