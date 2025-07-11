import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@supervisor/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@supervisor/components/ui/dialog";
import FormSubcategoria from "./formSubCategoria";
import { CategoryApi } from "../../types/categoriasDeliveryType";

interface Props {
  categoria: CategoryApi;
  subcategorias: CategoryApi[];
}

export function CategoriaCard({ categoria, subcategorias }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{categoria.label}</span>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormSubcategoria
              parentSlug={categoria.slug}
              onClose={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-1">
        {subcategorias.map((sub) => (
          <div
            key={sub.slug}
            className="rounded-md border p-2  text-sm"
          >
            <strong>{sub.label}</strong>
            <p className="text-muted-foreground text-xs">Produto (placeholder)</p>
          </div>
        ))}
      </div>
    </div>
  );
}
