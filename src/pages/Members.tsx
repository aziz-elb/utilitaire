import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Building,
  UserCheck,
} from "lucide-react";
import { Card , CardContent } from "@/components/ui/card";

import MembreList from "@/components/membre/MembresList";
import MembreConfig from "@/components/membre/MembreConfig";

const Members: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    return status === "Actif"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getTypeColor = (type: string) => {
    return type === "Interne"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Membres
          </h1>
          <p className="text-gray-600">
            Administration des utilisateurs et de leurs rôles
          </p>
        </div>
        {/* <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"> */}
        {/* <Button className="inwi_logo">
          <Plus className="h-4 w-4 mr-2 " />
          Nouveau Membre
        </Button> */}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des membres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      

      {/* Members Grid */}
      <div className="bg-white mt-3 rounded-lg shadow p-6 space-y-4">
        <MembreList />
      </div>

      <div className="bg-white mt-3 rounded-lg shadow p-6 space-y-4">
        <MembreConfig />
      </div>
    </div>
  );
};

export default Members;
