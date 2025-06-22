// MembreList.tsx (parent)
import { useEffect, useState } from "react";
import axios from "axios";
import MembreCrud from "./MembreCrud";
import MembreStatistique from "./MembreStatistique";

type Membre = {
  id: string;
  keycloak_user_id: string;
  fk_type_membre_id: string;
  nom_prenom: string;
  email: string;
  telephone: string;
  fk_entite_id: string;
  fk_fonction_id: string;
  interne_yn: boolean;
  date_creation: string;
  profile_picture_url: string;
  actif_yn: boolean;
};

type Fonction = {
  id: string;
  libelle: string;
};

type Entite = {
  id: string;
  titre: string;
};

type TypeMembre = {
  id: string;
  libelle: string;
};

const MembreList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [membres, setMembres] = useState<Membre[]>([]);
  const [fonctions, setFonctions] = useState<Fonction[]>([]);
  const [entites, setEntites] = useState<Entite[]>([]);
  const [typesMembre, setTypesMembre] = useState<TypeMembre[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [membresRes, fonctionsRes, entitesRes, typesMembreRes] = 
          await Promise.all([
            axios.get("http://localhost:8000/membre"),
            axios.get("http://localhost:8000/fonction"),
            axios.get("http://localhost:8000/entite"),
            axios.get("http://localhost:8000/type_membre")
          ]);

        // Ajout des données fictives pour la démo
        const membresWithStats = membresRes.data.map((membre: Membre) => ({
          ...membre,
          projets_count: Math.floor(Math.random() * 10),
          last_login: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          ).toISOString(),
        }));

        setMembres(membresWithStats);
        setFonctions(fonctionsRes.data);
        setEntites(entitesRes.data);
        setTypesMembre(typesMembreRes.data);
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

  return (<>
  

    <MembreStatistique membres={membres} />


    <div className="container mx-auto py-4">
      <MembreCrud 
        membres={membres}
        fonctions={fonctions}
        entites={entites}
        typesMembre={typesMembre}
        loading={loading}
        onMembreUpdated={(updatedMembres) => setMembres(updatedMembres)}
      />
    </div>
  </>
  );
};

export default MembreList;