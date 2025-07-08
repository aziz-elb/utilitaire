// MembreList.tsx (parent)
import { useEffect, useState } from "react";
import MembreCrud from "./MembreCrud";
import MembreStatistique from "./MembreStatistique";
import { getMembres, type Membre as ServiceMembre } from "@/services/membreService";
import { getFonctions, type Fonction as ServiceFonction } from "@/services/fonctionService";
import { getEntites, type Entite as ServiceEntite } from "@/services/entiteService";
import { getTypeMembres, type TypeMembre as ServiceTypeMembre } from "@/services/typeMembreService";
import { getRoles, type Role as ServiceRole } from "@/services/roleService";

// Use the types from the services
type Membre = ServiceMembre;
type Fonction = ServiceFonction;
type Entite = ServiceEntite;
type TypeMembre = ServiceTypeMembre;
type Role = ServiceRole;

const MembreList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [membres, setMembres] = useState<Membre[]>([]);
  const [fonctions, setFonctions] = useState<Fonction[]>([]);
  const [entites, setEntites] = useState<Entite[]>([]);
  const [typesMembre, setTypesMembre] = useState<TypeMembre[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [membresData, fonctionsData, entitesData, typesMembreData, rolesData] = 
          await Promise.all([
            getMembres(),
            getFonctions(),
            getEntites(),
            getTypeMembres(),
            getRoles()
          ]);

        // Ajout des données fictives pour la démo
        const membresWithStats = membresData.map((membre: Membre) => ({
          ...membre,
          projets_count: Math.floor(Math.random() * 10),
          last_login: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          ).toISOString(),
        }));

        setMembres(membresWithStats);
        setFonctions(fonctionsData);
        setEntites(entitesData);
        setTypesMembre(typesMembreData);
        setRoles(rolesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  // Transform membres for MembreStatistique to match expected interface
  const membresForStats = membres.map(membre => ({
    id: membre.id,
    actif_yn: membre.actifYn,
    interne_yn: membre.interneYn,
  }));

  return (<>
    <MembreStatistique membres={membresForStats} />

    <div className="container mx-auto py-4">
      <MembreCrud 
        membres={membres}
        fonctions={fonctions}
        entites={entites}
        typesMembre={typesMembre}
        roles={roles}
        loading={loading}
        onMembreUpdated={(updatedMembres) => setMembres(updatedMembres)}
      />
    </div>
  </>
  );
};

export default MembreList;