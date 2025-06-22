import { Archive, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

type TemplateDisplayEtapeProps = {
  etapesTemplate: {
    id: string;
    libelle: string;
    order: number;
  }[];
  onDelete: (id: string) => void;
  onOrderChange: (id: string, direction: "up" | "down") => void;
};

export default function TemplateDisplayEtape({
  etapesTemplate,
  onDelete,
  onOrderChange,
}: TemplateDisplayEtapeProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      <h3 className="text-lg font-semibold mb-3">Étapes du template</h3>

      {etapesTemplate.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          Aucune étape définie. Ajoutez votre première étape.
        </p>
      ) : (
        etapesTemplate.map((etape) => (
          <div
            key={etape.id}
            className="flex items-center justify-between gap-3 bg-background rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
              <span className="font-medium">{etape.libelle}</span>
              <span className="text-sm text-muted-foreground">
                (Ordre: {etape.order})
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOrderChange(etape.id, "up")}
                disabled={etape.order === 1}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOrderChange(etape.id, "down")}
                disabled={etape.order === etapesTemplate.length}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(etape.id)}
                className="text-destructive hover:text-destructive/80"
              >
                <Archive className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
