import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, ShieldCheck, UserRound, Users } from "lucide-react";

interface MembreStatistiqueProps {
  membres: {
    id: string;
    actif_yn: boolean;
    interne_yn: boolean;
  }[];
}

const MembreStatistique = ({ membres }: MembreStatistiqueProps) => {
  // Calcul des statistiques
  const totalMembres = membres.length;
  const membresActifs = membres.filter((m) => m.actif_yn).length;
  const membresInternes = membres.filter((m) => m.interne_yn).length;
  const membresExternes = totalMembres - membresInternes;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="hover:shadow-lg transition-shadow border-t-4 border-green-500 shadow-sm">
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {membresActifs}
            </div>
            <div className="text-sm text-gray-600">Membres actifs</div>
          </div>
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <BadgeCheck className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-t-4 border-blue-500 shadow-sm">
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {membresInternes}
            </div>
            <div className="text-sm text-gray-600">Internes</div>
          </div>
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-t-4 border-purple-500 shadow-sm">
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {membresExternes}
            </div>
            <div className="text-sm text-gray-600">Externes</div>
          </div>
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <UserRound className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-t-4 border-orange-500 shadow-sm">
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {totalMembres}
            </div>
            <div className="text-sm text-gray-600">Membres Total</div>
          </div>
          <div className="p-3 rounded-full bg-orange-100 text-orange-600">
            <Users className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembreStatistique;
