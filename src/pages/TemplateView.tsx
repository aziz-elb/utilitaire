import { useState, useEffect } from "react";
import { getTemplates, getEtapeModeles, addEtapeModele, updateTemplate, updateEtapeModele } from "@/services/templateService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import TemplateAddEtape from "@/components/template/TemplateAddEtape";
import TemplateDisplayEtape from "@/components/template/TemplateDisplayEtape";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Save } from "lucide-react";

type TemplateProjet = {
  id: string;
  description: string;
  actifYn: boolean;
};

type EtapeModele = {
  id: string;
  description: string;
  ordre: number;
  modeleProjetId: string;
};

export default function TemplateView() {
  const { tempid } = useParams<{ tempid: string }>();
  const [currentTemplate, setCurrentTemplate] = useState<TemplateProjet>({
    id: '',
    description: '',
    actifYn: true,
  });

  const [formData, setFormData] = useState<{
    description: string;
    actifYn: boolean;
  }>({
    description: '',
    actifYn: true,
  });

  // Chargement du template
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const templates: TemplateProjet[] = await getTemplates();
        const found = templates.find((t: TemplateProjet) => t.id === tempid);
        if (found) {
          setCurrentTemplate(found);
          setFormData({
            description: found.description,
            actifYn: found.actifYn,
          });
        }
      } catch (error) {
        toast.error("Erreur lors du chargement du template");
        console.error(error);
      }
    };

    fetchTemplate();
  }, [tempid]);

  // Gestion des étapes
  const [etapesTemplate, setEtapesTemplate] = useState<EtapeModele[]>([]);

  useEffect(() => {
    const fetchEtapes = async () => {
      try {
        const allEtapes: EtapeModele[] = await getEtapeModeles();
        setEtapesTemplate(allEtapes.filter((e: EtapeModele) => e.modeleProjetId === tempid));
      } catch (error) {
        toast.error("Erreur lors du chargement des étapes");
        console.error(error);
      }
    };
    if (currentTemplate.id) {
      fetchEtapes();
    }
  }, [currentTemplate, tempid]);

  // Sauvegarde du template et des étapes
  const handleSaveTemplate = async () => {
    try {
      // 1. Mettre à jour le template principal
      await updateTemplate(currentTemplate.id, {
        description: formData.description,
        actifYn: formData.actifYn,
      });

      // 2. Mettre à jour les étapes existantes ou en ajouter
      for (const etape of etapesTemplate) {
        if (etape.id && etape.id.length === 36) { // UUID existant
          await updateEtapeModele(etape.id, {
            description: etape.description,
            ordre: etape.ordre,
            modeleProjetId: etape.modeleProjetId,
          });
        } else {
          await addEtapeModele({
            description: etape.description,
            ordre: etape.ordre,
            modeleProjetId: currentTemplate.id,
          });
        }
      }
      toast.success("Template et étapes sauvegardés avec succès");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    }
  };

  // Gestion des étapes
  const handleAddEtape = (description: string) => {
    // Ajoute localement, pas d'appel API ici
    const tempId = `temp-${Date.now()}`;
    const newEtape: EtapeModele = {
      id: tempId,
      description,
      ordre: etapesTemplate.length + 1,
      modeleProjetId: currentTemplate.id,
    };
    setEtapesTemplate([...etapesTemplate, newEtape]);
    toast.success("Étape ajoutée localement");
  };

  const handleDeleteEtape = (id: string) => {
    setEtapesTemplate(etapesTemplate.filter((etape) => etape.id !== id));
    toast.success("Étape supprimée avec succès (mock)");
  };

  const handleOrderChange = (id: string, direction: "up" | "down") => {
    setEtapesTemplate((prev) => {
      // 1. Trouver l'index de l'étape à déplacer
      const oldIndex = prev.findIndex((etape) => etape.id === id);
      if (oldIndex === -1) return prev;

      // 2. Calculer le nouvel index
      const newIndex = direction === "up" ? oldIndex - 1 : oldIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      // 3. Créer une copie du tableau
      const newEtapes = [...prev];

      // 4. Échanger les éléments dans le tableau
      [newEtapes[oldIndex], newEtapes[newIndex]] = [
        newEtapes[newIndex],
        newEtapes[oldIndex],
      ];

      // 5. Mettre à jour les propriétés `ordre` pour qu'elles correspondent aux nouveaux index
      return newEtapes.map((etape, index) => ({
        ...etape,
        ordre: index + 1, // ordre = index
      }));
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Modification du Template</h1>
      <div className="flex flex-row justify-end gap-2">
        <Button
          onClick={handleSaveTemplate}
          variant="secondary"
          className="default"
          size="lg"
        >
          <Link
            to="/template"
            className="flex flex-row items-center justify-center gap-3"
          >
            <ChevronLeft />
            Retour
          </Link>
        </Button>
        <Button onClick={handleSaveTemplate} className="bg-inwi-purple/80 hover:bg-inwi-purple" variant="default" size="lg">
          <Save />
          Sauvegarder
        </Button>
      </div>

      {/* Section informations du template */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Informations générales</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description du template"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="actif"
              checked={formData.actifYn}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, actifYn: checked })
              }
            />
            <Label htmlFor="actif">Template actif</Label>
          </div>
        </div>
      </div>

      {/* Section gestion des étapes */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Gestion des étapes</h2>

        <TemplateAddEtape onAddEtape={handleAddEtape} />

        <TemplateDisplayEtape
          etapesTemplate={etapesTemplate
            .slice()
            .sort((a, b) => a.ordre - b.ordre)
            .map(e => ({
              id: e.id,
              libelle: e.description,
              order: e.ordre,
            }))}
          onDelete={handleDeleteEtape}
          onOrderChange={handleOrderChange}
        />
      </div>
    </div>
  );
}
