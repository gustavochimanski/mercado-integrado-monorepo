// components/ViewButton.tsx
"use client";

import { Eye } from "lucide-react";
import { Button } from "@supervisor/components/ui/button";

interface ViewButtonProps {
  onClick: () => void;
  className?: string;
}

export const ViewButton = ({ onClick, className }: ViewButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={(e) => {
      e.stopPropagation(); // 👈 bloqueia o clique de afetar a linha
      onClick();
    }}
    className="text-primary"
  >
    <Eye size={15} />
  </Button>
);
