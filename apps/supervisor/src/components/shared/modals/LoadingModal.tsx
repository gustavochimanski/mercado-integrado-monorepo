"use client";

import { Dialog, DialogPortal, DialogOverlay, DialogContent } from "@supervisor/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
}

export default function LoadingModal({ open }: Props) {
  return (
    <Dialog open={open}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="flex flex-col items-center justify-center gap-4 w-40 text-center pointer-events-none">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm font-medium">Carregando...</p>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
