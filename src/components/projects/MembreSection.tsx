import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembresTab } from "./MembresTab";
import { PartiesPrenantesTab } from "./PartiesPrenantesTab";

interface MembreSectionProps {
  projetId: string;
}

export const MembreSection = ({ projetId }: MembreSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des membres et parties prenantes</CardTitle>
        <CardDescription>Assigner et gérer les membres du projet</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="membres" className="space-y-4">
          <TabsList>
            <TabsTrigger value="membres">Membres du projet</TabsTrigger>
            <TabsTrigger value="parties-prenantes">Parties prenantes</TabsTrigger>
          </TabsList>

          <TabsContent value="membres" className="space-y-4">
            <MembresTab projetId={projetId} />
          </TabsContent>

          <TabsContent value="parties-prenantes" className="space-y-4">
            <PartiesPrenantesTab projetId={projetId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 