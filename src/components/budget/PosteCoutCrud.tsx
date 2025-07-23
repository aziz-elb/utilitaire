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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Archive, Edit, Eye, MoreHorizontal, CirclePlus } from "lucide-react";
import { Toaster, toast } from "sonner";
import { getPosteCouts, addPosteCout, updatePosteCout, deletePosteCout } from "@/services/posteCoutService";
import type { PosteCout } from "@/services/posteCoutService";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function PosteCoutCrud() {
  const [posteCouts, setPosteCouts] = useState<PosteCout[]>([]);
  const [loading, setLoading] = useState(true);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentPosteCout, setCurrentPosteCout] = useState<PosteCout | null>(null);

  const [libelle, setLibelle] = useState("");
  const [typePoste, setTypePoste] = useState("");
  const [ordreAffichage, setOrdreAffichage] = useState("");
  const [actifYn, setActifYn] = useState(true);

  useEffect(() => {
    fetchPosteCouts();
  }, []);

  const fetchPosteCouts = async () => {
    try {
      setLoading(true);
      const data = await getPosteCouts();
      setPosteCouts(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des postes de coût");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLibelle("");
    setTypePoste("");
    setOrdreAffichage("");
    setActifYn(true);
    setCurrentPosteCout(null);
  };

  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  const handleViewClick = (posteCout: PosteCout) => {
    setCurrentPosteCout(posteCout);
    setOpenViewDialog(true);
  };

  const handleEditClick = (posteCout: PosteCout) => {
    setCurrentPosteCout(posteCout);
    setLibelle(posteCout.libelle);
    setTypePoste(posteCout.typePoste);
    setOrdreAffichage(posteCout.ordreAffichage);
    setActifYn(posteCout.actifYn);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (posteCout: PosteCout) => {
    setCurrentPosteCout(posteCout);
    setOpenDeleteDialog(true);
  };

  const handleAddPosteCout = async () => {
    try {
      const newPosteCout = await addPosteCout({
        libelle: libelle.trim(),
        typePoste: typePoste.trim(),
        ordreAffichage: ordreAffichage.trim(),
        actifYn,
      });
      setPosteCouts([...posteCouts, newPosteCout]);
      setOpenAddDialog(false);
      resetForm();
      toast.success("Poste de coût ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du poste de coût");
      console.error(error);
    }
  };

  const handleEditPosteCout = async () => {
    if (!currentPosteCout) return;
    try {
      const updated = await updatePosteCout({
        id: currentPosteCout.id,
        libelle: libelle.trim(),
        typePoste: typePoste.trim(),
        ordreAffichage: ordreAffichage.trim(),
        actifYn,
      });
      const updatedPosteCouts = posteCouts.map((posteCout) =>
        posteCout.id === currentPosteCout.id ? updated : posteCout
      );
      setPosteCouts(updatedPosteCouts);
      setOpenEditDialog(false);
      resetForm();
      toast.success("Poste de coût modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du poste de coût");
      console.error(error);
    }
  };

  const handleDeletePosteCout = async () => {
    if (!currentPosteCout) return;
    try {
      await deletePosteCout(currentPosteCout.id);
      const filteredPosteCouts = posteCouts.filter(
        (posteCout) => posteCout.id !== currentPosteCout.id
      );
      setPosteCouts(filteredPosteCouts);
      setOpenDeleteDialog(false);
      resetForm();
      toast.success("Poste de coût supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du poste de coût");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="bottom-right" richColors />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des postes de coût</h1>
        <Button onClick={handleAddClick} className="inwi_btn">
          Ajouter <CirclePlus className="ml-2" />
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead>Type Poste</TableHead>
              <TableHead>Ordre Affichage</TableHead>
              <TableHead>Actif</TableHead>
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
            ) : posteCouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Aucun poste de coût disponible
                </TableCell>
              </TableRow>
            ) : (
              posteCouts.map((posteCout) => (
                <TableRow key={posteCout.id}>
                  <TableCell>{posteCout.id}</TableCell>
                  <TableCell>{posteCout.libelle}</TableCell>
                  <TableCell>{posteCout.typePoste}</TableCell>
                  <TableCell>{posteCout.ordreAffichage}</TableCell>
                  <TableCell>
                    <Badge className={`${posteCout.actifYn ? "text-green-600 bg-green-600/10" : "text-red-600 bg-red-600/10"}`}>
                    {posteCout.actifYn ? "Oui" : "Non"}
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
                        <DropdownMenuItem onClick={() => handleViewClick(posteCout)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(posteCout)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(posteCout)}
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
            <DialogTitle>Ajouter un poste de coût</DialogTitle>
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
              <Label htmlFor="typePoste" className="text-right">
                Type Poste
              </Label>
              <Select value={typePoste} onValueChange={setTypePoste}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEX">OPEX</SelectItem>
                  <SelectItem value="CAPEX">CAPEX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ordreAffichage" className="text-right">
                Ordre Affichage
              </Label>
              <Select value={ordreAffichage} onValueChange={setOrdreAffichage}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner l'ordre" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="actifYn" className="text-right">
                Actif
              </Label>
              <Switch
                id="actifYn"
                checked={actifYn}
                onCheckedChange={setActifYn}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddPosteCout}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale d'édition */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le poste de coût</DialogTitle>
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
              <Label htmlFor="typePoste-edit" className="text-right">
                Type Poste
              </Label>
              <Select value={typePoste} onValueChange={setTypePoste}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEX">OPEX</SelectItem>
                  <SelectItem value="CAPEX">CAPEX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ordreAffichage-edit" className="text-right">
                Ordre Affichage
              </Label>
              <Select value={ordreAffichage} onValueChange={setOrdreAffichage}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner l'ordre" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="actifYn-edit" className="text-right">
                Actif
              </Label>
              <Switch
                id="actifYn-edit"
                checked={actifYn}
                onCheckedChange={setActifYn}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditPosteCout}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le poste de coût</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce poste de coût ? Cette action est irréversible.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeletePosteCout}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modale de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du poste de coût</DialogTitle>
          </DialogHeader>
          {currentPosteCout && (
            <div className="grid gap-4 py-4">
              <div>
                <strong>ID:</strong> {currentPosteCout.id}
              </div>
              <div>
                <strong>Libellé:</strong> {currentPosteCout.libelle}
              </div>
              <div>
                <strong>Type Poste:</strong> {currentPosteCout.typePoste}
              </div>
              <div>
                <strong>Ordre Affichage:</strong> {currentPosteCout.ordreAffichage}
              </div>
              <div>
                <strong>Actif:</strong> {currentPosteCout.actifYn ? "Oui" : "Non"}
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