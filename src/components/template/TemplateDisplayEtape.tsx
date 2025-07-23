import { Archive, ChevronDown, ChevronUp, GripVertical, MoreHorizontal, Eye, Pencil, Trash2, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

type TemplateDisplayEtapeProps = {
  etapesTemplate: {
    id: string;
    libelle: string;
    order: number;
    description?: string;
  }[];
  onDelete: (id: string) => void;
  onOrderChange: (id: string, direction: "up" | "down") => void;
  onUpdate?: (id: string, libelle: string, description: string, ordre: number) => void;
};

export default function TemplateDisplayEtape({
  etapesTemplate,
  onDelete,
  onOrderChange,
  onUpdate,
}: TemplateDisplayEtapeProps) {
  const [viewEtape, setViewEtape] = useState<any | null>(null);
  const [editEtape, setEditEtape] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<{ libelle: string; description: string; ordre: number }>({ libelle: '', description: '', ordre: 1 });
  // --- Order edit mode states ---
  const [editOrderMode, setEditOrderMode] = useState(false);
  // Fix: ensure etapesTemplate is always an array and not undefined
  const [localEtapes, setLocalEtapes] = useState((etapesTemplate ?? []).slice().sort((a, b) => a.order - b.order));
  const [orderChanged, setOrderChanged] = useState(false);

  // Sync localEtapes with etapesTemplate when not in editOrderMode
  // Fix: in useEffect, ensure etapesTemplate is defined
  useEffect(() => {
    if (!editOrderMode) {
      setLocalEtapes((etapesTemplate ?? []).slice().sort((a, b) => a.order - b.order));
      setOrderChanged(false);
    }
  }, [etapesTemplate, editOrderMode]);

  // Move up/down logic
  const moveEtapeUp = (index: number) => {
    if (index === 0) return;
    const newEtapes = [...localEtapes];
    [newEtapes[index - 1], newEtapes[index]] = [newEtapes[index], newEtapes[index - 1]];
    setLocalEtapes(newEtapes.map((e, i) => ({ ...e, order: i + 1 })));
    setOrderChanged(true);
  };
  const moveEtapeDown = (index: number) => {
    if (index === localEtapes.length - 1) return;
    const newEtapes = [...localEtapes];
    [newEtapes[index], newEtapes[index + 1]] = [newEtapes[index + 1], newEtapes[index]];
    setLocalEtapes(newEtapes.map((e, i) => ({ ...e, order: i + 1 })));
    setOrderChanged(true);
  };

  // Save order logic
  const handleSaveOrder = async () => {
    if (!orderChanged || !onUpdate) return;
    for (const etape of localEtapes.filter(e => typeof e.id === 'string')) {
      await onUpdate(etape.id as string, etape.libelle, etape.description, etape.order);
    }
    setEditOrderMode(false);
    setOrderChanged(false);
  };

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      <h3 className="text-lg font-semibold mb-3">Étapes du template</h3>

      {/* Order edit mode controls */}
      <div className="flex gap-2 mb-2">
        {!editOrderMode && (
          <Button onClick={() => setEditOrderMode(true)} variant="outline">Modifier l'ordre</Button>
        )}
        {editOrderMode && (
          <>
            <Button onClick={handleSaveOrder} disabled={!orderChanged} variant="default">Enregistrer l'ordre</Button>
            <Button onClick={() => { setEditOrderMode(false); setOrderChanged(false); setLocalEtapes(etapesTemplate.slice().sort((a, b) => a.order - b.order)); }} variant="outline">Annuler</Button>
          </>
        )}
      </div>
      <ul className="space-y-2">
        {(editOrderMode ? localEtapes : etapesTemplate.slice().sort((a, b) => a.order - b.order)).map((etape, idx) => (
          <li key={etape.id} className="flex items-center gap-2 border rounded p-2">
            <span className="flex-1">
              <strong>{etape.libelle}</strong> <br />
              <span className="text-sm text-gray-500">{etape.description}</span>
            </span>
            {editOrderMode && (
              <>
                <Button onClick={() => moveEtapeUp(idx)} disabled={idx === 0} size="icon" variant="ghost"><ChevronUp /></Button>
                <Button onClick={() => moveEtapeDown(idx)} disabled={idx === (localEtapes.length - 1)} size="icon" variant="ghost"><ChevronDown /></Button>
              </>
            )}
            {!editOrderMode && (
              <>
                <Button size="sm" variant="outline" onClick={() => { setViewEtape(etape); }}><Eye /></Button>
                <Button size="sm" variant="outline" onClick={() => { setEditEtape(etape); setEditForm({ libelle: etape.libelle, description: etape.description || '', ordre: etape.order }); }}><SquarePen /></Button>
                <Button size="sm" variant="destructive" onClick={() => { if (onDelete && typeof etape.id === 'string') onDelete(etape.id); }}><Trash2 /></Button>
              </>
            )}
          </li>
        ))}
      </ul>
      {/* Dialog Voir */}
      <Dialog open={!!viewEtape} onOpenChange={() => setViewEtape(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détail de l'étape</DialogTitle>
          </DialogHeader>
          {viewEtape && (
            <div className="space-y-2">
              <div><b>Libellé :</b> {viewEtape.libelle}</div>
              <div><b>Ordre :</b> {viewEtape.order}</div>
              <div><b>Description :</b> {viewEtape.description || '-'} </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewEtape(null)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modifier */}
      <Dialog open={!!editEtape} onOpenChange={() => setEditEtape(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'étape</DialogTitle>
          </DialogHeader>
          {editEtape && (
            <form
              onSubmit={e => {
                e.preventDefault();
                onUpdate && onUpdate(editEtape.id, editForm.libelle, editForm.description, editForm.ordre);
                setEditEtape(null);
              }}
              className="space-y-3"
            >
              <Input
                value={editForm.libelle}
                onChange={e => setEditForm(f => ({ ...f, libelle: e.target.value }))}
                placeholder="Libellé"
                required
              />
              <Textarea
                value={editForm.description}
                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Description"
              />
              <Input
                type="number" className="hidden"
                value={editForm.ordre}
                min={1}
                onChange={e => setEditForm(f => ({ ...f, ordre: Number(e.target.value) }))}
                placeholder="Ordre"
                required
              />
              <DialogFooter>
                <Button type="submit">Valider</Button>
                <Button type="button" variant="outline" onClick={() => setEditEtape(null)}>Annuler</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
