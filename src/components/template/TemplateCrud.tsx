"use client";

import { useNavigate } from "react-router-dom";
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
  SquarePen,
  ShieldMinus,
  ShieldCheck,
  Copy,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { getTemplates, addTemplate, deleteTemplate, updateTemplate, dupliquerTemplate } from "@/services/templateService";
import { cn } from "@/lib/utils";

import type { TemplateProjet } from '@/services/templateService';

export default function TemplateCrud() {
  // États principaux
  const [templates, setTemplates] = useState<TemplateProjet[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // États pour les modales
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<TemplateProjet | null>(
    null
  );

  const navigate = useNavigate();

  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    libelle: "",
    version: "",
    description: "",
    actifYn: true,
    etapeModeles: [],
  });

  // Charger les données initiales
  useEffect(() => {
    fetchTemplatesList();
  }, []);

  const fetchTemplatesList = async () => {
    try {
      setLoading(true);
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des templates");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Formatage des dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      libelle: "",
      version: "",
      description: "",
      actifYn: true,
      etapeModeles: [],
    });
    setCurrentTemplate(null);
  };

  // Gestion des clics
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  const handleViewClick = (id: string) => {
    navigate(`/template/${id}`);
  };

  const handleEditClick = (template: TemplateProjet) => {
    setCurrentTemplate(template);
    setFormData({
      libelle: template.libelle,
      version: template.version,
      description: template.description,
      actifYn: template.actifYn,
      etapeModeles: [],
    });
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (template: TemplateProjet) => {
    setCurrentTemplate(template);
    setOpenDeleteDialog(true);
  };

  // Opérations CRUD
  const handleAddTemplate = async () => {
    try {
      const newTemplate = {
        libelle: formData.libelle.trim(),
        version: formData.version.trim(),
        description: formData.description.trim(),
        actifYn: formData.actifYn,
        etapeModeles: formData.etapeModeles,
      };
      const created = await addTemplate(newTemplate);
      setTemplates([...templates, created]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Template ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du template");
      console.error(error);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!currentTemplate) return;
    try {
      await deleteTemplate(currentTemplate.id);
      const filteredTemplates = templates.filter(
        (t) => t.id !== currentTemplate.id
      );
      setTemplates(filteredTemplates);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Template supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du template");
      console.error(error);
    }
  };

  // Fonction pour activer/désactiver un template
  const handleToggleStatus = async (template: TemplateProjet) => {
    try {
      const newStatus = !template.actifYn;
      // const updated = await updateTemplate(template.id, { actifYn: newStatus });
      const updated = await updateTemplate(template.id, { ...template,actifYn: newStatus });
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? { ...t, actifYn: updated.actifYn } : t))
      );
      toast.success(
        newStatus
          ? "Template activé avec succès"
          : "Template désactivé avec succès"
      );
    } catch (error) {
      toast.error(
        `Erreur lors de ${template.actifYn ? "la désactivation" : "l'activation"} du template`
      );
      console.error(error);
    }
  };

  const handleDupliquerTemplate = async (id: string) => {
    try{
      const newTemplate = await dupliquerTemplate(id);
      setTemplates([...templates, newTemplate]);
      toast.success("Template dupliqué avec succès");
    }catch(error){
      toast.error("Erreur lors de la duplication du template");
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des templates de projet</h1>
        <Button
          onClick={handleAddClick}
          className="inwi_btn bg-inwi-purple/80 hover:bg-inwi-purple"
        >
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
          {/* Tableau des templates */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : templates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Aucun template disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>{template.id}</TableCell>
                      <TableCell>
                        <span
                          className="font-medium hover:underline hover:cursor-pointer"
                          onClick={() => handleViewClick(template.id)}
                        >
                          {template.libelle}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className="font-medium hover:underline hover:cursor-pointer"
                          onClick={() => handleViewClick(template.id)}
                        >
                          {template.description}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className="font-medium hover:underline hover:cursor-pointer"
                          onClick={() => handleViewClick(template.id)}
                        >
                          {template.version}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            template.actifYn
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }
                        >
                          {template.actifYn ? "Actif" : "Inactif"}
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
                              onClick={(e) => {
                                handleViewClick(template.id);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={(e) => {
                                handleDeleteClick(template);
                              }}
                              
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                handleToggleStatus(template);
                              }}
                            >
                              {" "}
                              {template.actifYn ? (
                                <ShieldMinus className="h-4 w-4 mr-2" />
                              ) : (
                                <ShieldCheck className="h-4 w-4 mr-2" />
                              )}{" "}
                              {template.actifYn ? "Désactiver" : "Activer"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                handleDupliquerTemplate(template.id);
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Dupliquer
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
              <p>Chargement des templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Aucun template disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>
                        <span
                        className="font-medium hover:underline hover:cursor-pointer"
                          onClick={() => handleViewClick(template.id)}
                        >
                          {template.libelle}
                        </span>

                        
                      </CardTitle>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                          <DropdownMenuItem
                            onClick={(e) => {
                              handleViewClick(template.id);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              handleDeleteClick(template);
                            }}
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            
                            onClick={(e) => {
                              handleToggleStatus(template);
                            }}
                          >
                            {" "}
                            {template.actifYn ? (
                              <ShieldMinus className="h-4 w-4 mr-2" />
                            ) : (
                              <ShieldCheck className="h-4 w-4 mr-2" />
                            )}{" "}
                            {template.actifYn ? "Désactiver" : "Activer"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                              onClick={(e) => {
                                handleDupliquerTemplate(template.id);
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Dupliquer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                  <div>{template.description}</div>
                  <div className="flex justify-between items-center">
                  <Badge
                      variant={template.actifYn ? "default" : "outline"}
                      className={
                        template.actifYn
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }
                    >
                      {template.actifYn ? "Actif" : "Inactif"}
                    </Badge>
                    <Badge
                      variant={template.actifYn ? "default" : "outline"}
                      className="bg-blue-200 text-blue-800"
                    >
                      {template.version}
                    </Badge>

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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="libelle">Libellé</Label>
                <Input
                  id="libelle"
                  value={formData.libelle}
                  onChange={(e) =>
                    setFormData({ ...formData, libelle: e.target.value })
                  }
                  placeholder="Libellé du template"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 ">
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) =>
                      setFormData({ ...formData, version: e.target.value })
                    }
                    placeholder="Version du template"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actif">Actif</Label>
                  <Switch
                    id="actif"
                    checked={formData.actifYn}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, actifYn: checked })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description du template"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={(e) => {
                setOpenAddDialog(false);
              }}
         
            >
              Annuler
            </Button>
            <Button
              type="submit"
              onClick={() => {
                handleAddTemplate();
              }}
              className="inwi_btn bg-inwi-purple/80 hover:bg-inwi-purple"
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
            <DialogTitle>Détails du template</DialogTitle>
          </DialogHeader>
          {currentTemplate && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">ID</Label>
                  <div>{currentTemplate.id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Description</Label>
                  <div>{currentTemplate.description}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Statut</Label>
                  <div>{currentTemplate.actifYn ? "Actif" : "Inactif"}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Date création</Label>
                  <div>{formatDate(new Date().toISOString())}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={(e) => {
                setOpenViewDialog(false);
              }}
              className="inwi_btn"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le template</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le template{" "}
              <span className="font-semibold">{currentTemplate?.description}</span>{" "}
              ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={(e) => {
                setOpenDeleteDialog(false);
              }}
         
            >
              Annuler
            </Button>
            <Button
           
              onClick={(e) => {
                handleDeleteTemplate();
              }}
              className="inwi_btn"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
