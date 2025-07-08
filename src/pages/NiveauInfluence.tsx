import React from 'react';
import NiveauInfluenceCrud from '@/components/projects/NiveauInfluenceCrud';

export default function NiveauInfluence() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestion des Niveaux d'Influence</h1>
        <p className="text-muted-foreground">
          Gérez les différents niveaux d'influence des parties prenantes
        </p>
      </div>
      <NiveauInfluenceCrud />
    </div>
  );
} 