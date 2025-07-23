import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Star } from "lucide-react";
import api from "@/services/api";
import { getTypeProjets } from "@/services/typeProjetService";
import { getStatutProjets } from "@/services/statutProjetService";

interface ProjectFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  complexityFilter: string;
  onComplexityFilterChange: (value: string) => void;
  progressFilter: string;
  onProgressFilterChange: (value: string) => void;
  passationFilter: string;
  onPassationFilterChange: (value: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  complexityFilter,
  onComplexityFilterChange,
  progressFilter,
  onProgressFilterChange,
  passationFilter,
  onPassationFilterChange,
  onClearFilters,
  activeFiltersCount,
}) => {
  const [typesProjet, setTypesProjet] = useState<any[]>([]);
  const [statutsProjet, setStatutsProjet] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [typesRes, statutsRes] = await Promise.all([
          getTypeProjets(),
          getStatutProjets(),
        ]);

        setTypesProjet(typesRes);
        setStatutsProjet(statutsRes);
        
        // Endpoints temporairement désactivés car ils n'existent pas
        // setTypesProjet([]);
        // setStatutsProjet([]);
      } catch (error) {
        console.error("Error fetching filters data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltersData();
  }, []);

  const renderStars = (count: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < count
                ? "fill-current text-amber-500 "
                : "fill-current text-gray-200 "
            }
          />
        ))}
      </div>
    );
  };

  const progressIntervals = [
    { value: "all", label: "Toutes progressions" },
    { value: "0-20", label: "0-20%" },
    { value: "20-40", label: "20-40%" },
    { value: "40-60", label: "40-60%" },
    { value: "60-80", label: "60-80%" },
    { value: "80-100", label: "80-100%" },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher des projets..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Type de projet */}
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tous types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            {typesProjet.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.libelle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Statut projet */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tous statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            {statutsProjet.map((statut) => (
              <SelectItem key={statut.id} value={statut.id}>
                {statut.libelle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Complexité */}
        <Select
          value={complexityFilter}
          onValueChange={onComplexityFilterChange}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Toutes complexités" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes complexités</SelectItem>
            {[1, 2, 3, 4, 5].map((level) => (
              <SelectItem key={level} value={level.toString()}>
                <div className="flex items-center gap-2">
                  {renderStars(level)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Progression */}
        <Select value={progressFilter} onValueChange={onProgressFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Toutes progressions" />
          </SelectTrigger>
          <SelectContent>
            {progressIntervals.map((interval) => (
              <SelectItem key={interval.value} value={interval.value}>
                {interval.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Passation */}
        <Select value={passationFilter} onValueChange={onPassationFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Passation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous Passation</SelectItem>
            <SelectItem value="true">Terminée</SelectItem>
            <SelectItem value="false">En cours</SelectItem>
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-inwi-primary/10 text-inwi-primary"
            >
              {activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""}{" "}
              actif{activeFiltersCount > 1 ? "s" : ""}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectFilters;
