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
import { Archive, Edit, Eye, MoreHorizontal, CirclePlus } from "lucide-react";
import { Toaster, toast } from "sonner";
import { getBudgets, addBudget, updateBudget, deleteBudget } from "@/services/budgetService";
import type { Budget } from "@/services/budgetService";
import { getPosteCouts } from "@/services/posteCoutService";
import type { PosteCout } from "@/services/posteCoutService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {createAllocationBudget , type AllocationBudgetCreatePayload} from "@/services/allocationBudgetService";
import { getProjects , type Project} from "@/services/projectService";

export default function BudgetCrud() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [posteCouts, setPosteCouts] = useState<PosteCout[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openAddAllocationDialog, setOpenAddAllocationDialog] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);

  const [libelle, setLibelle] = useState("");
  const [description, setDescription] = useState("");
  const [posteCoutId, setPosteCoutId] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [newAllocation , setnewAllocation] = useState<AllocationBudgetCreatePayload | null>(null);

  // État pour la modale d'assignation de projet
  const [openAssignProjectDialog, setOpenAssignProjectDialog] = useState(false);
  const [selectedBudgetForProject, setSelectedBudgetForProject] = useState<Budget | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  useEffect(() => {
    fetchBudgets();
    fetchPosteCouts();
    fetchProjectsList();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des budgets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchProjectsList = async () => {
    try{
      const data = await getProjects();
      setProjects(data);
    }catch(error){
      toast.error("Erreur lors du chargement des projets");
      console.error(error);
    }
  }

  const fetchPosteCouts = async () => {
    try {
      const data = await getPosteCouts();
      setPosteCouts(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des postes de coût");
      console.error(error);
    }
  };

  const resetForm = () => {
    setLibelle("");
    setDescription("");
    setPosteCoutId("");
    setCurrentBudget(null);
  };

  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  const handleViewClick = (budget: Budget) => {
    setCurrentBudget(budget);
    setOpenViewDialog(true);
  };

  const handleEditClick = (budget: Budget) => {
    setCurrentBudget(budget);
    setLibelle(budget.libelle);
    setDescription(budget.description);
    setPosteCoutId(budget.posteCout?.id || "");
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (budget: Budget) => {
    setCurrentBudget(budget);
    setOpenDeleteDialog(true);
  };

  const handleAddBudget = async () => {
    try {
      const newBudget = await addBudget({
        libelle: libelle.trim(),
        description: description.trim(),
        posteCoutId,
      });
      setBudgets([...budgets, newBudget]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Budget ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du budget");
      console.error(error);
    }
  };

  const handleEditBudget = async () => {
    if (!currentBudget) return;
    try {
      const updated = await updateBudget({
        id: currentBudget.id,
        libelle: libelle.trim(),
        description: description.trim(),
        posteCoutId,
        posteCout: currentBudget.posteCout,
        allocationBudgetList: currentBudget.allocationBudgetList,
      });
      const updatedBudgets = budgets.map((budget) =>
        budget.id === currentBudget.id ? updated : budget
      );
      setBudgets(updatedBudgets);
      setOpenEditDialog(false);
      resetForm();
      toast.success("Budget modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du budget");
      console.error(error);
    }
  };

  const handleDeleteBudget = async () => {
    if (!currentBudget) return;
    try {
      await deleteBudget(currentBudget.id);
      const filteredBudgets = budgets.filter(
        (budget) => budget.id !== currentBudget.id
      );
      setBudgets(filteredBudgets);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Budget supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du budget");
      console.error(error);
    }
  };



  const handleAddAllocationClick = (budgetID: string) => {
    setnewAllocation({
      budgetId: budgetID,
      projectId: "",
      montantPrevu: 0,
      montantReel: 0,
    });
    setOpenAddAllocationDialog(true);
  }

  const handleAddAllocationBudget = async () => {
    if(!newAllocation) return;
    try{
      await createAllocationBudget(newAllocation);
      setOpenAddAllocationDialog(false);
      toast.success("Allocation ajoutée avec succès");
    }catch(error){
      toast.error("Erreur lors de l'ajout de l'allocation");
      console.error(error);
    }
  }

  // Handler pour ouvrir la modale d'assignation
  const handleAssignProjectClick = (budget: Budget) => {
    setSelectedBudgetForProject(budget);
    setSelectedProjectId("");
    setOpenAssignProjectDialog(true);
  };

  // Handler pour assigner le projet (simulation locale)
  const handleAssignProject = () => {
    if (!selectedBudgetForProject || !selectedProjectId) return;
    // Ici, on simule l'association côté front (à remplacer par un appel API si besoin)
    setBudgets((prev) => prev.map(b =>
      b.id === selectedBudgetForProject.id
        ? { ...b, assignedProject: projects.find(p => p.id === selectedProjectId) }
        : b
    ));
    setOpenAssignProjectDialog(false);
    toast.success("Projet assigné au budget avec succès");
  };


  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des budgets</h1>
        <Button onClick={handleAddClick} className="inwi_btn">
          Ajouter <CirclePlus className="ml-2" />
        </Button>
      </div>
      <Tabs defaultValue="table" onValueChange={(value) => setViewMode(value as "table" | "cards")}>
        <TabsList className="mb-4">
          <TabsTrigger value="table">Tableau</TabsTrigger>
          <TabsTrigger value="cards">Cartes</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Poste de coût</TableHead>
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
            ) : budgets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Aucun budget disponible
                </TableCell>
              </TableRow>
            ) : (
              budgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>{budget.id}</TableCell>
                  <TableCell>{budget.libelle}</TableCell>
                  <TableCell>{budget.description}</TableCell>
                  <TableCell>{budget.posteCout ? budget.posteCout.libelle : ''}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white">
                        <DropdownMenuItem onClick={() => handleViewClick(budget)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddAllocationClick(budget.id)}>
                          <CirclePlus className="h-4 w-4 mr-2" />
                          Ajouter une allocation
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={() => handleAssignProjectClick(budget)}>
                          <CirclePlus className="h-4 w-4 mr-2" />
                          Assigner un projet
                        </DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => handleEditClick(budget)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(budget)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <Card key={budget.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{budget.libelle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-gray-600 text-sm">{budget.description}</div>
                  <Badge className="mb-2">{budget.posteCout ? budget.posteCout.libelle : ''}</Badge>
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewClick(budget)}>
                    <Eye className="h-4 w-4 mr-2" /> Voir
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAddAllocationClick(budget.id)}>
                    <CirclePlus className="h-4 w-4 mr-2" />
                    Allocation
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(budget)}>
                    <Edit className="h-4 w-4 mr-2" /> Modifier
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      {/* Modale d'ajout */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un budget</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="libelle" className="text-right">
                Libellé
              </Label>
              <Input
                id="libelle"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                className="col-span-3"
                placeholder="Entrez le libellé"
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="posteCoutId" className="text-right">
                Poste de coût
              </Label>
              <Select value={posteCoutId} onValueChange={setPosteCoutId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un poste de coût" />
                </SelectTrigger>
                <SelectContent>
                  {posteCouts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.libelle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddBudget}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le budget</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="libelle-edit" className="text-right">
                Libellé
              </Label>
              <Input
                id="libelle-edit"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                className="col-span-3"
                placeholder="Entrez le libellé"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description-edit" className="text-right">
                Description
              </Label>
              <Textarea
                id="description-edit"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Entrez la description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="posteCoutId-edit" className="text-right">
                Poste de coût
              </Label>
              <Select value={posteCoutId} onValueChange={setPosteCoutId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un poste de coût" />
                </SelectTrigger>
                <SelectContent>
                  {posteCouts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.libelle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditBudget}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le budget</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce budget ? Cette action est irréversible.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteBudget}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du budget</DialogTitle>
          </DialogHeader>
          {currentBudget && (
            <div className="grid gap-4 py-4">
              <div>
                <strong>ID:</strong> {currentBudget.id}
              </div>
              <div>
                <strong>Libellé:</strong> {currentBudget.libelle}
              </div>
              <div>
                <strong>Description:</strong> {currentBudget.description}
              </div>
              <div>
                <strong>Poste de coût:</strong> {currentBudget.posteCout ? currentBudget.posteCout.libelle : ''}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenViewDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'ajout d'allocation */}
       {/* Modale d'ajout */}
       <Dialog open={openAddAllocationDialog} onOpenChange={setOpenAddAllocationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une allocation budgétaire</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budgetId" className="text-right">
                Budget
              </Label>
              <Select disabled={true} value={newAllocation?.budgetId} >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.libelle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectId" className="text-right">
                Projet
              </Label>
              <Select value={newAllocation?.projectId || ""} onValueChange={v => setnewAllocation(na => na ? { ...na, projectId: v } : null)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un projet" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.titre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="montantPrevu" className="text-right">
                Montant Prévu
              </Label>
              <Input
                id="montantPrevu"
                type="number"
                value={newAllocation?.montantPrevu}
                onChange={(e) => setnewAllocation(na => na ? { ...na, montantPrevu: Number(e.target.value) } : null)}
                className="col-span-3"
                placeholder="Montant prévu"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="montantReel" className="text-right">
                Montant Réel
              </Label>
              <Input
                id="montantReel"
                type="number"
                value={newAllocation?.montantReel}
                onChange={(e) => setnewAllocation(na => na ? { ...na, montantReel: Number(e.target.value) } : null)}
                className="col-span-3"
                placeholder="Montant réel"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddAllocationBudget}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'assignation de projet */}
      <Dialog open={openAssignProjectDialog} onOpenChange={setOpenAssignProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un projet à ce budget</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assign-project" className="text-right">
                Projet
              </Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un projet" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.titre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAssignProjectDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAssignProject} disabled={!selectedProjectId}>
              Assigner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}