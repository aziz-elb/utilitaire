import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

type TemplateAddEtapeProps = {
  onAddEtape: (libelle: string) => void;
};

export default function TemplateAddEtape({
  onAddEtape,
}: TemplateAddEtapeProps) {
  const [newEtape, setNewEtape] = useState("");

  const handleAdd = () => {
    if (newEtape.trim()) {
      onAddEtape(newEtape);
      setNewEtape("");
    }
  };

  return (
    <div className="flex items-center gap-3 bg-background rounded-lg border p-4 shadow-sm">
      <Input
        value={newEtape}
        onChange={(e) => setNewEtape(e.target.value)}
        placeholder="Nom de la nouvelle étape"
        className="flex-1"
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <Button
        size="icon"
        onClick={handleAdd}
        disabled={!newEtape.trim()}
        className="h-10 w-10 bg-inwi-purple/90 hover:bg-inwi-purple"
      >
        <Plus className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
}
