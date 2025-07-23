import { useState, useEffect } from "react";
import { getTemplates, getEtapeTemplates, addEtapeTemplate, updateEtapeTemplate, deleteEtapeTemplate, updateTemplate } from "@/services/templateService";
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
import type { TemplateProjet, EtapeTemplate } from '@/services/templateService';

export default function TemplateView() {
  const { tempid } = useParams<{ tempid: string }>();
  const [currentTemplate, setCurrentTemplate] = useState<TemplateProjet>({
    id: '',
    libelle: '',
    description: '',
    version: '',
    actifYn: true,
  });

  const [formData, setFormData] = useState<{
    libelle: string;
    version: string;
    description: string;
    actifYn: boolean;
  }>({
    libelle: '',
    version: '',
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
            libelle: found.libelle,
            version: found.version,
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
  const [etapesTemplate, setEtapesTemplate] = useState<EtapeTemplate[]>([]);

  const fetchEtapes = async () => {
    try {
      if (!tempid) return;
      const Etapes: EtapeTemplate[] = await getEtapeTemplates(tempid);
      setEtapesTemplate(Etapes);
    } catch (error) {
      toast.error("Erreur lors du chargement des étapes");
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentTemplate.id) {
      fetchEtapes();
    }
  }, [currentTemplate, tempid]);

  // Sauvegarde du template
  const handleSaveTemplate = async () => {
    try {
      await updateTemplate(currentTemplate.id, {
        libelle: formData.libelle,
        version: formData.version,
        description: formData.description,
        actifYn: formData.actifYn,
      });
      toast.success("Template sauvegardé avec succès");
      fetchEtapes();
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde du template");
      console.error(error);
    }
  };

  // Ajout d'une étape
  const handleAddEtape = async (libelle: string, description: string) => {
    if (!tempid) return;
    try {
      const ordre = etapesTemplate.length + 1;
      await addEtapeTemplate({
        libelle,
        description,
        ordre,
        templateProjetId: tempid,
      });
      toast.success("Étape ajoutée avec succès");
      fetchEtapes();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'étape");
      console.error(error);
    }
  };

  // Suppression d'une étape
  const handleDeleteEtape = async (id: string) => {
    try {
      await deleteEtapeTemplate(id);
      toast.success("Étape supprimée avec succès");
      fetchEtapes();
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'étape");
      console.error(error);
    }
  };

  // Modification de l'ordre d'une étape
  const handleOrderChange = async (id: string, direction: "up" | "down") => {
    if (!tempid) return;
    try {
      const index = etapesTemplate.findIndex((etape) => etape.id === id);
      if (index === -1) return;
      let newOrder = etapesTemplate[index].ordre;
      if (direction === "up" && index > 0) {
        newOrder = etapesTemplate[index].ordre - 1;
      } else if (direction === "down" && index < etapesTemplate.length - 1) {
        newOrder = etapesTemplate[index].ordre + 1;
      } else {
        return;
      }
      await updateEtapeTemplate(id, {
        libelle: etapesTemplate[index].libelle,
        description: etapesTemplate[index].description || '',
        ordre: newOrder,
        templateProjetId: tempid,
      });
      toast.success("Ordre de l'étape modifié");
      fetchEtapes();
    } catch (error) {
      toast.error("Erreur lors du changement d'ordre");
      console.error(error);
    }
  };

  // Mise à jour d'une étape
  const handleUpdateEtape = async (id: string, libelle: string, description: string, ordre: number) => {
    if (!tempid) return;
    try {
      await updateEtapeTemplate(id, {
        libelle,
        description,
        ordre, // <-- use the new order!
        templateProjetId: tempid,
      });
      toast.success("Étape modifiée avec succès");
      fetchEtapes();
    } catch (error) {
      toast.error("Erreur lors de la modification de l'étape");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Modification du Template</h1>
      <div className="flex flex-row justify-end gap-2">
        <Link
          to="/template"
          className="flex flex-row items-center justify-center gap-3"
        >
        <Button
          variant="secondary"
          className="default"
          size="lg"
        >
            <ChevronLeft />
            Retour
        </Button>
        </Link>
      </div>

      {/* Section informations du template */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Informations générales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="libelle">Libellé</Label>
            <Input
              id="libelle"
              value={formData.libelle}
              onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
              placeholder="Libellé du template"
            />
          </div>
          <div>
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              placeholder="Version du template"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="actif"
              checked={formData.actifYn}
              onCheckedChange={(checked) => setFormData({ ...formData, actifYn: checked })}
            />
            <Label htmlFor="actif">Template actif</Label>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description du template"
          />
        </div>
        <div className="flex flex-row justify-end mt-4">
          <Button onClick={handleSaveTemplate} className="bg-inwi-purple/80 hover:bg-inwi-purple" variant="default" size="lg">
            <Save />
            Sauvegarder
          </Button>
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
              libelle: e.libelle,
              description: e.description,
              order: e.ordre,
            }))}
          onDelete={handleDeleteEtape}
          onOrderChange={handleOrderChange}
          onUpdate={(id, libelle, description, ordre) => handleUpdateEtape(id, libelle, description, ordre)}
        />
      </div>
    </div>
  );
}
