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
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  getResources,
  addResource,
  updateResource,
  deleteResource,
  AssignRessourceToRole,
  type Resource,
} from "@/services/resourceService";
import { getRoles } from "@/services/roleService";



export default function ResourceCrud() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Modals
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);

  // Form state
  const [formData, setFormData] = useState<{ name: string; uris: string; role?: string }>({
    name: "",
    uris: "",
    role: "",
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getResources();
      const roles = await getRoles();
      setRoles(roles);
      setResources(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des resources");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      uris: "",
    });
    setCurrentResource(null);
  };

  // Modal handlers
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };
  const handleViewClick = (resource: Resource) => {
    setCurrentResource(resource);
    setOpenViewDialog(true);
  };
  const handleEditClick = (resource: Resource) => {
    setCurrentResource(resource);
    setFormData({
      name: resource.name,
      uris: (resource.uris || []).join("\n"),
    });
    setOpenEditDialog(true);
  };
  const handleDeleteClick = (resource: Resource) => {
    setCurrentResource(resource);
    setOpenDeleteDialog(true);
  };

  // Ouvre la modale d'assignation de rôle
  const handleAssignClick = (resource: Resource) => {
    setCurrentResource(resource);
    setFormData((prev) => ({ ...prev, role: "" }));
    setOpenAssignDialog(true);
  };

  // Fonction d'assignation de ressource à un rôle
  const handleAssignRole = async () => {
    if (!currentResource || !formData.role) return;
    try {
      await AssignRessourceToRole(currentResource._id, formData.role);
      setOpenAssignDialog(false);
      toast.success("Ressource assignée au rôle avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'assignation de la ressource au rôle");
      console.error(error);
    }
  };

  // CRUD
  const handleAddResource = async () => {
    try {
      await addResource({
        name: formData.name.trim(),
        uris: formData.uris.split("\n").map(u => u.trim()).filter(Boolean),
      });
      await fetchResources();
      setOpenAddDialog(false);
      resetForm();
      toast.success("Resource ajoutée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la resource");
      console.error(error);
    }
  };

  const handleEditResource = async () => {
    if (!currentResource) return;
    try {
      await updateResource(currentResource._id, {
        name: formData.name.trim(),
        uris: formData.uris.split("\n").map(u => u.trim()).filter(Boolean),
      });
      await fetchResources();
      setOpenEditDialog(false);
      resetForm();
      toast.success("Resource modifiée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification de la resource");
      console.error(error);
    }
  };

  const handleDeleteResource = async () => {
    if (!currentResource) return;
    try {
      await deleteResource(currentResource._id);
      await fetchResources();
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Resource supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la resource");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Resources</h1>
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
          {/* Tableau des resources */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>URIs</TableHead>
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
                ) : resources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Aucune resource disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  resources.map((resource) => (
                    <TableRow key={resource._id}>
                      <TableCell>{resource._id}</TableCell>
                      <TableCell>{resource.name}</TableCell>
                      <TableCell>
                        <ul className="list-disc pl-4">
                          {(resource.uris || []).map((uri, idx) => (
                            <li key={idx}>{uri}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white">
                            <DropdownMenuItem onClick={() => handleViewClick(resource)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(resource)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAssignClick(resource)}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Assigner à un rôle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(resource)} className="text-red-600">
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
              <p>Chargement des resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Aucune resource disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <Card
                  key={resource._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle>{resource.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-1">
                      <Label className="text-sm text-gray-500">ID</Label>
                      <p>{resource._id}</p>
                      <Label className="text-sm text-gray-500 mt-2">URIs</Label>
                      <ul className="list-disc pl-4">
                        {(resource.uris || []).map((uri, idx) => (
                          <li key={idx}>{uri}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClick(resource)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(resource)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignClick(resource)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" /> Assigner à un rôle
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
            <DialogTitle>Ajouter une resource</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom de la resource"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uris">URIs (une par ligne)</Label>
              <textarea
                id="uris"
                value={formData.uris}
                onChange={(e) => setFormData({ ...formData, uris: e.target.value })}
                placeholder="/api/projects/*\n/api/users/*"
                rows={3}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddResource} className="inwi_btn">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la resource</DialogTitle>
          </DialogHeader>
          {currentResource && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">ID</Label>
                  <div>{currentResource._id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Nom</Label>
                  <div>{currentResource.name}</div>
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-gray-500">URIs</Label>
                  <ul className="list-disc pl-4">
                    {(currentResource?.uris || []).map((uri, idx) => (
                      <li key={idx}>{uri}</li>
                    ))}
                  </ul>
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
            <DialogTitle>Modifier la resource</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_name">Nom</Label>
              <Input
                id="edit_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom de la resource"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_uris">URIs (une par ligne)</Label>
              <textarea
                id="edit_uris"
                value={formData.uris}
                onChange={(e) => setFormData({ ...formData, uris: e.target.value })}
                placeholder="/api/projects/*\n/api/users/*"
                rows={3}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditResource} className="inwi_btn">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la resource</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la resource {" "}
              <span className="font-semibold">{currentResource?.name}</span> ?
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
            <Button variant="destructive" onClick={handleDeleteResource} className="inwi_btn">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



       {/* Modale d'assignation de rôle */}
       <Dialog open={openAssignDialog} onOpenChange={setOpenAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un rôle</DialogTitle>
            <DialogDescription>
              Assignez un rôle à la ressource {" "}
              <span className="font-semibold">{currentResource?.name}</span> ?
            </DialogDescription>
          </DialogHeader>
          
            <div>
              <Label htmlFor="assign-role" className="text-right my-3">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
   
          <DialogFooter>
          
            <Button variant="destructive" onClick={handleAssignRole} className="inwi_btn">
              Assigner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 