import { Button } from "@supervisor/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@supervisor/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import FormSubcategoria from "./formSubCategoria";

export function BotaoNovaCategoria() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2" />
          Nova Categoria Raiz
        </Button>
      </DialogTrigger>
      <DialogContent>
        <FormSubcategoria parentSlug={null} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
