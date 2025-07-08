import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FolderTree, // Type Projet
  Flag, // Statut Projet
  ListTree, // Type Etape
  Milestone, // Statut Etape
  MessageSquare, // Type Commentaire
  UserCog,
  EyeOff, // Type Partie Prenante
  TrendingUp, // Niveau Influence
  Activity, // Type Activite
} from "lucide-react";
import TypeProjetCrud from "./TypeProjetCrud";
import StatutProjetCrud from "./StatutProjetCrud";
import TypeEtapeCrud from "./TypeEtapeCrud";
import StatutEtapeCrud from "./StatutEtapeCrud";
import TypeCommentaireCrud from "./TypeCommentaireCrud";
import TypePartiePrenanteCrud from "./TypePartiePrenanteCrud";
import NiveauInfluenceCrud from "./NiveauInfluenceCrud";
import TypeActiviteCrud from "./TypeActiviteCrud";







export default function ProjectConfig() {
  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="liste" className="w-full">
        {/* En-tête des onglets */}
        <TabsList className="grid w-full grid-cols-6  gap-1">
          {/* <TabsTrigger
            value="types_projets"
            className="flex justify-center items-center"
          >
            <FolderTree className="h-4 w-4 mr-2" />
            <span>Type Projet</span>
          </TabsTrigger>

          <TabsTrigger
            value="statuts_projets"
            className="flex justify-center items-center"
          >
            <Flag className="h-4 w-4 mr-2" />
            <span>Statut Projet</span>
          </TabsTrigger> */}

          <TabsTrigger
            value="types_etapes"
            className="flex justify-center items-center"
          >
            <ListTree className="h-4 w-4 mr-2" />
            <span>Type Etape</span>
          </TabsTrigger>

          <TabsTrigger
            value="statuts_etapes"
            className="flex justify-center items-center"
          >
            <Milestone className="h-4 w-4 mr-2" />
            <span>Statut Etape</span>
          </TabsTrigger>

          {/* <TabsTrigger
            value="types_commentaires"
            className="flex justify-center items-center"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>Commentaire</span>
          </TabsTrigger> */}

          <TabsTrigger
            value="type_partie_prenante"
            className="flex justify-center items-center"
          >
            <UserCog className="h-4 w-4 mr-2" />
            <span>Partie Prenante</span>
          </TabsTrigger>

          <TabsTrigger
            value="niveau_influence"
            className="flex justify-center items-center"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            <span>Niveau Influence</span>
          </TabsTrigger>

          <TabsTrigger
            value="type_activite"
            className="flex justify-center items-center"
          >
            <Activity className="h-4 w-4 mr-2" />
            <span>Type Activité</span>
          </TabsTrigger>
          <TabsTrigger value="" className="flex justify-center items-center">
          <EyeOff className="h-4 w-4 mr-2" />
        </TabsTrigger>
        </TabsList>

        {/* Contenu des onglets */}
        <div className="mt-6">
          {/* <TabsContent value="types_projets">
            <TypeProjetCrud />
          </TabsContent>

          <TabsContent value="statuts_projets">
            <StatutProjetCrud />
          </TabsContent> */}

          <TabsContent value="types_etapes">
            <TypeEtapeCrud />
          </TabsContent>

          <TabsContent value="statuts_etapes">
            <StatutEtapeCrud />
          </TabsContent>

          {/* <TabsContent value="types_commentaires">
            <TypeCommentaireCrud />
          </TabsContent> */}

          <TabsContent value="type_partie_prenante">
            <TypePartiePrenanteCrud />
          </TabsContent>

          <TabsContent value="niveau_influence">
            <NiveauInfluenceCrud />
          </TabsContent>

          <TabsContent value="type_activite">
            <TypeActiviteCrud />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
