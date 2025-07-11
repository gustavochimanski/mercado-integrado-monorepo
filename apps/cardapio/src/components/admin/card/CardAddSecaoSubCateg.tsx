import {  PlusCircle } from "lucide-react";
import { Card } from "../../ui/card";
import { useAuthStatus } from "../../../hooks/useAuthStatus";

const CardAddSecaoSubCateg = () => {
  const { isAdmin } = useAuthStatus();

  if (!isAdmin) return null;

  return (
    <Card className="bg-muted flex flex-col items-center w-full gap-1 p-2 border-dashed border-2 border-gray-300 hover:border-primary transition-colors">
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-background flex items-center justify-center">
        <PlusCircle className="w-8 h-8 text-muted-foreground" />
      </div>
      <span className="block text-center text-sm font-semibold truncate max-w-full">
        Nova Seção
      </span>
    </Card>
  );
};

export default CardAddSecaoSubCateg;