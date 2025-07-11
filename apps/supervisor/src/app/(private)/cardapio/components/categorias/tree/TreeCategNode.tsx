import { useState } from "react";
import { Button } from "@supervisor/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@supervisor/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@supervisor/components/ui/alert-dialog";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { CategoryNode } from "../../../types/categoriasDeliveryType";
import FormSubcategoria from "../formSubCategoria";
import { useMutateCategoria } from "../../../hooks/useMutateCategoria";

interface Props {
  node: CategoryNode;
}

export function TreeCategoriaNode({ node }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { remove } = useMutateCategoria(null);

  const handleDelete = () => {
    remove.mutate(node.id);
    setConfirmDelete(false);
  };

  return (
    <div className="pl-2 border-l border-gray-300">
      <div className="flex items-center gap-2">
        {node.children.length > 0 ? (
          <button onClick={() => setExpanded(!expanded)} className="text-gray-600">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className="w-[16px]" />
        )}

        <span className="font-medium">{node.label}</span>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormSubcategoria parentSlug={node.slug} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>

        <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100">
              <Trash2 size={16} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Deletar categoria?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Essa ação é irreversível. A categoria <strong>{node.label}</strong> será excluída.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmDelete(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Deletar
                </Button>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {expanded && node.children.length > 0 && (
        <div className="ml-4 mt-2 space-y-1">
          {node.children.map((child) => (
            <TreeCategoriaNode key={child.slug} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
