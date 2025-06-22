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
} from "lucide-react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import TemplateDisplateEtape from "@/components/template/TemplateDisplayEtape";
import TemplateAddEtape from "@/components/template/TemplateAddEtape";
import TemplateDisplayEtape from "@/components/template/TemplateDisplayEtape";

const API_URL = "http://localhost:8000/template_projet";

type TemplateProjet = {
  id: string;
  libelle: string;
  description: string;
  version: string;
  date_creation: string;
  date_modification: string;
  actif_yn: boolean;
};

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
    description: "",
    version: "",
    actif_yn: true,
  });

  // Charger les données initiales
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTemplates(response.data);
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
      description: "",
      version: "",
      actif_yn: true,
    });
    setCurrentTemplate(null);
  };

  // Gestion des clics
  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  // const handleViewClick = (id) => {
  //   navigate(`/template/${id}`);

  //   // setCurrentTemplate(template);
  //   // setOpenViewDialog(true);
  // };

  const handleEditClick = (template: TemplateProjet) => {
    setCurrentTemplate(template);
    setFormData({
      libelle: template.libelle,
      description: template.description,
      version: template.version,
      actif_yn: template.actif_yn,
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
        ...formData,
        libelle: formData.libelle.toLowerCase().trim(),
        description: formData.description.toLowerCase().trim(),
        date_creation: new Date().toISOString(),
        date_modification: new Date().toISOString(),
      };

      const response = await axios.post(API_URL, newTemplate);
      setTemplates([...templates, response.data]);
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
      await axios.delete(`${API_URL}/${currentTemplate.id}`);
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
      const newStatus = !template.actif_yn;
      const response = await axios.patch(`${API_URL}/${template.id}`, {
        actif_yn: newStatus,
        date_modification: new Date().toISOString(),
      });

      setTemplates(
        templates.map((t) =>
          t.id === template.id ? { ...t, actif_yn: newStatus } : t
        )
      );

      toast.success(
        newStatus
          ? "Template activé avec succès"
          : "Template désactivé avec succès"
      );
    } catch (error) {
      toast.error(
        `Erreur lors de ${
          template.actif_yn ? "la désactivation" : "l'activation"
        } du template`
      );
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des templates de projet</h1>
        <Button
          onClick={(e) => {
            handleAddClick();
          }}
          className="bg-inwi-purple/80 hover:bg-inwi-purple"
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
                  <TableHead>Version</TableHead>
                  <TableHead>Date création</TableHead>
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
                      <TableCell>{template.libelle}</TableCell>
                      <TableCell>{template.version}</TableCell>
                      <TableCell>
                        {formatDate(template.date_creation)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            template.actif_yn
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }
                        >
                          {template.actif_yn ? "Actif" : "Inactif"}
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
                                // handleViewClick(template.id);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={(e) => {
                                handleDeleteClick(template);
                              }}
                              className="text-red-600"
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={cn(
                                template.actif_yn
                                  ? "text-red-500"
                                  : "text-green-500"
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                handleToggleStatus(template);
                              }}
                            >
                              {" "}
                              {template.actif_yn ? (
                                <ShieldMinus className="h-4 w-4 mr-2" />
                              ) : (
                                <ShieldCheck className="h-4 w-4 mr-2" />
                              )}{" "}
                              {template.actif_yn ? "Désactiver" : "Activer"}
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
                    <div className="flex justify-between items-start">
                      <CardTitle>{template.libelle}</CardTitle>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                          <DropdownMenuItem
                            onClick={(e) => {
                              // handleViewClick(template.id);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              handleDeleteClick(template);
                            }}
                            className="text-red-600"
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={cn(
                              template.actif_yn
                                ? "text-red-500"
                                : "text-green-500"
                            )}
                            onClick={(e) => {
                              handleToggleStatus(template);
                            }}
                          >
                            {" "}
                            {template.actif_yn ? (
                              <ShieldMinus className="h-4 w-4 mr-2" />
                            ) : (
                              <ShieldCheck className="h-4 w-4 mr-2" />
                            )}{" "}
                            {template.actif_yn ? "Désactiver" : "Activer"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-500">
                        Description
                      </Label>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {template.description || "Aucune description"}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Badge
                      variant={template.actif_yn ? "default" : "outline"}
                      className="bg-inwi-tertiary/20 text-inwi-dark-purple"
                    >
                      {template.version}
                    </Badge>
                    <Badge
                      variant={template.actif_yn ? "default" : "outline"}
                      className={
                        template.actif_yn
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }
                    >
                      {template.actif_yn ? "Actif" : "Inactif"}
                    </Badge>
                  </CardFooter>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="libelle">Libellé</Label>
                <Input
                  id="libelle"
                  value={formData.libelle}
                  onChange={(e) =>
                    setFormData({ ...formData, libelle: e.target.value })
                  }
                  placeholder="Nom du template"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                  placeholder="Ex: 1.0"
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
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
                  <Label className="text-gray-500">Libellé</Label>
                  <div>{currentTemplate.libelle}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Version</Label>
                  <div>{currentTemplate.version}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Statut</Label>
                  <div>{currentTemplate.actif_yn ? "Actif" : "Inactif"}</div>
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-gray-500">Description</Label>
                  <div>
                    {currentTemplate.description || "Aucune description"}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Date création</Label>
                  <div>{formatDate(currentTemplate.date_creation)}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Date modification</Label>
                  <div>{formatDate(currentTemplate.date_modification)}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={(e) => {
                setOpenViewDialog(false);
              }}
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
              <span className="font-semibold">{currentTemplate?.libelle}</span>{" "}
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
              variant="destructive"
              onClick={(e) => {
                handleDeleteTemplate();
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
