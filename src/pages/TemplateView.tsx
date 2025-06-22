import { useState, useEffect } from "react";
import axios from "axios";
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

export default function TemplateView() {
  const { tempid } = useParams();
  const [currentTemplate, setCurrentTemplate] = useState({
    libelle: "",
    version: "",
    description: "",
    actif_yn: true,
    etapes: [],
  });

  const [formData, setFormData] = useState({
    libelle: "",
    version: "",
    description: "",
    actif_yn: true,
  });

  // Chargement du template
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/template_projet/${tempid}`
        );
        setCurrentTemplate(res.data);
        setFormData({
          libelle: res.data.libelle,
          version: res.data.version,
          description: res.data.description,
          actif_yn: res.data.actif_yn,
        });
      } catch (error) {
        toast.error("Erreur lors du chargement du template");
        console.error(error);
      }
    };

    fetchTemplate();
  }, [tempid]);

  // Gestion des étapes
  const [etapesTemplate, setEtapesTemplate] = useState([]);

  useEffect(() => {
    if (currentTemplate.etapes) {
      setEtapesTemplate(currentTemplate.etapes);
    }
  }, [currentTemplate]);

  // Sauvegarde du template
  const handleSaveTemplate = async () => {
    try {
      const updatedTemplate = {
        ...formData,
        etapes: etapesTemplate,
        date_modification: new Date().toISOString(),
      };

      await axios.put(
        `http://localhost:8000/template_projet/${tempid}`,
        updatedTemplate
      );
      toast.success("Template sauvegardé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde du template");
      console.error(error);
    }
  };

  // Gestion des étapes
  const handleAddEtape = (libelle) => {
    const newEtape = {
      id: Date.now().toString(),
      libelle,
      order: etapesTemplate.length + 1,
    };
    setEtapesTemplate([...etapesTemplate, newEtape]);
    toast.success("Étape ajoutée avec succès");
  };

  const handleDeleteEtape = (id) => {
    setEtapesTemplate(etapesTemplate.filter((etape) => etape.id !== id));
    toast.success("Étape supprimée avec succès");
  };

  const handleOrderChange = (id, direction) => {
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

      // 5. Mettre à jour les propriétés `order` pour qu'elles correspondent aux nouveaux index
      return newEtapes.map((etape, index) => ({
        ...etape,
        order: index + 1, // order = index
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
            <Label htmlFor="libelle">Libellé</Label>
            <Input
              id="libelle"
              value={formData.libelle}
              onChange={(e) =>
                setFormData({ ...formData, libelle: e.target.value })
              }
              placeholder="Nom du template"
            />
          </div>

          <div>
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={formData.version}
              onChange={(e) =>
                setFormData({ ...formData, version: e.target.value })
              }
              placeholder="Ex: 1.0"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description du template"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="actif"
              checked={formData.actif_yn}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, actif_yn: checked })
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
          etapesTemplate={etapesTemplate}
          onDelete={handleDeleteEtape}
          onOrderChange={handleOrderChange}
        />
      </div>
    </div>
  );
}
