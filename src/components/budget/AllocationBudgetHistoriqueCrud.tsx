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
import { Archive, Edit, Eye, MoreHorizontal, RefreshCcw } from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  getAllocationBudgetHistoriques,
  getAllocationBudgetHistoriquesByBudget,
  getAllocationBudgetHistoriquesByProject,
  updateAllocationBudgetHistorique,
  deleteAllocationBudgetHistorique,
  type AllocationBudgetHistorique,
} from "@/services/allocationBudgetHistoriqueService";
import { getBudgets, type Budget } from "@/services/budgetService";
import { getProjects, type Project } from "@/services/projectService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AllocationBudgetHistoriqueCrud() {
  const [historiques, setHistoriques] = useState<AllocationBudgetHistorique[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentHistorique, setCurrentHistorique] =
    useState<AllocationBudgetHistorique | null>(null);
  const [motifModification, setMotifModification] = useState("");

  useEffect(() => {
    fetchBudgets();
    fetchProjects();
    fetchHistoriques();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des budgets");
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des projets");
    }
  };

  const fetchHistoriques = async () => {
    setLoading(true);
    try {
      let data: AllocationBudgetHistorique[] = [];
      if (budgetFilter) {
        data = await getAllocationBudgetHistoriquesByBudget(budgetFilter);
      } else if (projectFilter) {
        data = await getAllocationBudgetHistoriquesByProject(projectFilter);
      } else {
        data = await getAllocationBudgetHistoriques();
      }
      setHistoriques(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des historiques");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoriques();
    // eslint-disable-next-line
  }, [budgetFilter, projectFilter]);

  const handleEditClick = (historique: AllocationBudgetHistorique) => {
    setCurrentHistorique(historique);
    setMotifModification(historique.motifModification || "");
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (historique: AllocationBudgetHistorique) => {
    setCurrentHistorique(historique);
    setOpenDeleteDialog(true);
  };

  const handleViewClick = (historique: AllocationBudgetHistorique) => {
    setCurrentHistorique(historique);
    setOpenViewDialog(true);
  };

  const handleEditHistorique = async () => {
    if (!currentHistorique) return;
    try {
      const updated = await updateAllocationBudgetHistorique(
        currentHistorique.id,
        motifModification
      );
      setHistoriques(
        historiques.map((h) => (h.id === updated.id ? updated : h))
      );
      setOpenEditDialog(false);
      toast.success("Motif modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du motif");
    }
  };

  const handleDeleteHistorique = async () => {
    if (!currentHistorique) return;
    try {
      await deleteAllocationBudgetHistorique(currentHistorique.id);
      setHistoriques(historiques.filter((h) => h.id !== currentHistorique.id));
      setOpenDeleteDialog(false);
      toast.success("Suppression réussie");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Recherche sur motif, nom modificateur, email
  const filteredHistoriques = historiques.filter((h) => {
    const searchLower = search.toLowerCase();
    return (
      h.motifModification?.toLowerCase().includes(searchLower) ||
      h.modificateurMembre.nomPrenom.toLowerCase().includes(searchLower) ||
      h.modificateurMembre.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />
      <h1 className="text-2xl font-bold mb-6">
        Historique des allocations budgétaires
      </h1>
      <div className="flex flex-row items-center justify-between mb-6 gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Recherche un motif , un membre ou un email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-3/4"
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <Select
            value={budgetFilter}
            onValueChange={(v) => {
              setBudgetFilter(v);
              setProjectFilter("");
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par budget" />
            </SelectTrigger>
            <SelectContent>
              {budgets.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={projectFilter}
            onValueChange={(v) => {
              setProjectFilter(v);
              setBudgetFilter("");
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par projet" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.titre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setBudgetFilter("");
              setProjectFilter("");
            }}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Montant Prévu</TableHead>
              <TableHead>Montant Réel</TableHead>
              <TableHead>Modificateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Motif</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : filteredHistoriques.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Aucun historique trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredHistoriques.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.id}</TableCell>
                  <TableCell>{h.montantPrevu}</TableCell>
                  <TableCell>{h.montantReel}</TableCell>
                  <TableCell>{h.modificateurMembre.nomPrenom}</TableCell>
                  <TableCell>{h.modificateurMembre.email}</TableCell>
                  <TableCell>{h.motifModification}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white">
                        <DropdownMenuItem onClick={() => handleViewClick(h)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(h)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier motif
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(h)}
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
      {/* Modale d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le motif</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="motifModification-edit" className="text-right">
              Motif de modification
            </Label>
            <Textarea
              id="motifModification-edit"
              value={motifModification}
              onChange={(e) => setMotifModification(e.target.value)}
              placeholder="Motif de modification"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditHistorique}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'historique</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cet historique ? Cette action est
            irréversible.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteHistorique}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de l'historique</DialogTitle>
          </DialogHeader>
          {currentHistorique && (
            <div className="grid gap-4 py-4">
              <div>
                <strong>ID:</strong> {currentHistorique.id}
              </div>
              <div>
                <strong>Montant Prévu:</strong> {currentHistorique.montantPrevu}
              </div>
              <div>
                <strong>Montant Réel:</strong> {currentHistorique.montantReel}
              </div>
              <div>
                <strong>Modificateur:</strong>{" "}
                {currentHistorique.modificateurMembre.nomPrenom}
              </div>
              <div>
                <strong>Email:</strong>{" "}
                {currentHistorique.modificateurMembre.email}
              </div>
              <div>
                <strong>Motif:</strong> {currentHistorique.motifModification}
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
