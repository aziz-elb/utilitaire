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
import {
  getAllocationBudgets,
  createAllocationBudget,
  updateAllocationBudget,
  deleteAllocationBudget,
  type AllocationBudget,
  type AllocationBudgetCreatePayload,
  type AllocationBudgetUpdatePayload
} from "@/services/allocationBudgetService";
import { getBudgets, type Budget } from "@/services/budgetService";
import { getProjects, type Project } from "@/services/projectService";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function AllocationBudgetCrud() {
  const [allocations, setAllocations] = useState<AllocationBudget[]>([]);
  const [loading, setLoading] = useState(true);

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentAllocation, setCurrentAllocation] = useState<AllocationBudget | null>(null);

  const [budgetId, setBudgetId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [montantPrevu, setMontantPrevu] = useState(0);
  const [montantReel, setMontantReel] = useState(0);
  const [motifModification, setMotifModification] = useState("");

  useEffect(() => {
    fetchAllocations();
    fetchBudgets();
    fetchProjects();
  }, []);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const data = await getAllocationBudgets();
      setAllocations(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des allocations budgétaires");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des budgets");
      console.error(error);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des projets");
      console.error(error);
    }
  };

  const resetForm = () => {
    setBudgetId("");
    setProjectId("");
    setMontantPrevu(0);
    setMontantReel(0);
    setMotifModification("");
    setCurrentAllocation(null);
  };

  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  const handleViewClick = (allocation: AllocationBudget) => {
    setCurrentAllocation(allocation);
    setOpenViewDialog(true);
  };

  const handleEditClick = (allocation: AllocationBudget) => {
    setCurrentAllocation(allocation);
    setBudgetId(allocation.budgetDto.id);
    setProjectId(allocation.projectDto.id);
    setMontantPrevu(allocation.montantPrevu);
    setMontantReel(allocation.montatReel);
    setMotifModification("");
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (allocation: AllocationBudget) => {
    setCurrentAllocation(allocation);
    setOpenDeleteDialog(true);
  };

  const handleAddAllocation = async () => {
    try {
      const payload: AllocationBudgetCreatePayload = {
        budgetId,
        projectId,
        montantPrevu: Number(montantPrevu),
        montantReel: Number(montantReel),
      };
      const newAllocation = await createAllocationBudget(payload);
      setAllocations([...allocations, newAllocation]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Allocation budgétaire ajoutée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'allocation budgétaire");
      console.error(error);
    }
  };

  const handleEditAllocation = async () => {
    if (!currentAllocation) return;
    try {
      const payload: AllocationBudgetUpdatePayload = {
        budgetId,
        projectId,
        montantPrevu: Number(montantPrevu),
        montantReel: Number(montantReel),
        motifModification,
      };
      const updated = await updateAllocationBudget(currentAllocation.id, payload);
      const updatedAllocations = allocations.map((a) =>
        a.id === currentAllocation.id ? updated : a
      );
      setAllocations(updatedAllocations);
      setOpenEditDialog(false);
      resetForm();
      toast.success("Allocation budgétaire modifiée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification de l'allocation budgétaire");
      console.error(error);
    }
  };

  const handleDeleteAllocation = async () => {
    if (!currentAllocation) return;
    try {
      await deleteAllocationBudget(currentAllocation.id);
      const filteredAllocations = allocations.filter(
        (a) => a.id !== currentAllocation.id
      );
      setAllocations(filteredAllocations);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Allocation budgétaire supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'allocation budgétaire");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des allocations budgétaires</h1>
        <Button onClick={handleAddClick} className="inwi_btn">
          Ajouter <CirclePlus className="ml-2" />
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Montant Prévu</TableHead>
              <TableHead>Montant Réel</TableHead>
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
            ) : allocations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Aucune allocation budgétaire disponible
                </TableCell>
              </TableRow>
            ) : (
              allocations.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell>{a.budgetDto.libelle}</TableCell>
                  <TableCell>{a.projectDto.titre}</TableCell>
                  <TableCell>{a.montantPrevu}</TableCell>
                  <TableCell>{a.montatReel}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white">
                        <DropdownMenuItem onClick={() => handleViewClick(a)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(a)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(a)}
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
      {/* Modale d'ajout */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une allocation budgétaire</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budgetId" className="text-right">
                Budget
              </Label>
              <Select value={budgetId} onValueChange={setBudgetId}>
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
              <Select value={projectId} onValueChange={setProjectId}>
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
                value={montantPrevu}
                onChange={(e) => setMontantPrevu(Number(e.target.value))}
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
                value={montantReel}
                onChange={(e) => setMontantReel(Number(e.target.value))}
                className="col-span-3"
                placeholder="Montant réel"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddAllocation}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'allocation budgétaire</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budgetId-edit" className="text-right">
                Budget
              </Label>
              <Select value={budgetId} onValueChange={setBudgetId}>
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
              <Label htmlFor="projectId-edit" className="text-right">
                Projet
              </Label>
              <Select value={projectId} onValueChange={setProjectId}>
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
              <Label htmlFor="montantPrevu-edit" className="text-right">
                Montant Prévu
              </Label>
              <Input
                id="montantPrevu-edit"
                type="number"
                value={montantPrevu}
                onChange={(e) => setMontantPrevu(Number(e.target.value))}
                className="col-span-3"
                placeholder="Montant prévu"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="montantReel-edit" className="text-right">
                Montant Réel
              </Label>
              <Input
                id="montantReel-edit"
                type="number"
                value={montantReel}
                onChange={(e) => setMontantReel(Number(e.target.value))}
                className="col-span-3"
                placeholder="Montant réel"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="motifModification-edit" className="text-right">
                Motif de modification
              </Label>
              <Input
                id="motifModification-edit"
                value={motifModification}
                onChange={(e) => setMotifModification(e.target.value)}
                className="col-span-3"
                placeholder="Motif de modification"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditAllocation}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'allocation budgétaire</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette allocation budgétaire ? Cette action est irréversible.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteAllocation}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de l'allocation budgétaire</DialogTitle>
          </DialogHeader>
          {currentAllocation && (
            <div className="grid gap-4 py-4">
              <div>
                <strong>ID:</strong> {currentAllocation.id}
              </div>
              <div>
                <strong>Budget:</strong> {currentAllocation.budgetDto.libelle}
              </div>
              <div>
                <strong>Projet:</strong> {currentAllocation.projectDto.titre}
              </div>
              <div>
                <strong>Montant Prévu:</strong> {currentAllocation.montantPrevu}
              </div>
              <div>
                <strong>Montant Réel:</strong> {currentAllocation.montatReel}
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
    </div>
  );
}
