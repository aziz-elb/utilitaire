
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EyeOff, Wallet, DollarSign, History } from "lucide-react";
import PosteCoutCrud from "./PosteCoutCrud";
import AllocationBudgetCrud from "./AllocationBudgetCrud";
import AllocationBudgetHistoriqueCrud from "./AllocationBudgetHistoriqueCrud";

function BudgetConfig() {

    return <>
        <Tabs defaultValue="membres" className="w-full">
      {/* En-tête des onglets */}
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="fonctions">
          <Wallet className="h-4 w-4 mr-2" /> Poste Cout
        </TabsTrigger>
        <TabsTrigger value="entites">
          <DollarSign className="h-4 w-4 mr-2" /> Allocation Budget
        </TabsTrigger>
        <TabsTrigger value="types">
          <History className="h-4 w-4 mr-2" /> Historique
        </TabsTrigger>
        
        <TabsTrigger value="" className="flex justify-center items-center">
          <EyeOff className="h-4 w-4 mr-2" />
        </TabsTrigger>
      </TabsList>

      {/* Contenu des onglets */}
      <div className="mt-6">
        <TabsContent value="fonctions">
          <PosteCoutCrud />
        </TabsContent>

        <TabsContent value="entites">
          <AllocationBudgetCrud />
        </TabsContent>

        <TabsContent value="types">
          <AllocationBudgetHistoriqueCrud />
        </TabsContent>


      </div>
    </Tabs>
    
    </>

}
export default BudgetConfig;





