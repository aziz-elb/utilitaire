"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Briefcase, Users, Building, Key, User, EyeOff } from "lucide-react";

import FonctionCrud from "./FonctionCrud";
import EntiteCrud from "./EntiteCrud";
import TypeMembreCrud from "./TypeMembreCrud";
import RoleCrud from "./RoleCrud";

const MembreConfig = () => {
  return (
    <Tabs defaultValue="membres" className="w-full">
      {/* En-tête des onglets */}
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="fonctions">
          <Briefcase className="h-4 w-4 mr-2" /> Fonctions
        </TabsTrigger>
        <TabsTrigger value="entites">
          <Building className="h-4 w-4 mr-2" /> Entités
        </TabsTrigger>
        <TabsTrigger value="types">
          <Users className="h-4 w-4 mr-2" /> Types
        </TabsTrigger>
        <TabsTrigger value="roles">
          <Key className="h-4 w-4 mr-2" /> Rôles
        </TabsTrigger>
        <TabsTrigger value="" className="flex justify-center items-center">
          <EyeOff className="h-4 w-4 mr-2" />
        </TabsTrigger>
      </TabsList>

      {/* Contenu des onglets */}
      <div className="mt-6">
        <TabsContent value="fonctions">
          <FonctionCrud />
        </TabsContent>

        <TabsContent value="entites">
          <EntiteCrud />
        </TabsContent>

        <TabsContent value="types">
          <TypeMembreCrud />
        </TabsContent>

        <TabsContent value="roles">
          <RoleCrud />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default MembreConfig;
