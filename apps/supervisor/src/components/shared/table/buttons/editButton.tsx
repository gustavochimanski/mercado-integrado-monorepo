"use client";

import { IconButton } from "@mui/material";
import { Pencil } from "lucide-react";

type Props = {
  onClick: () => void;
  size?: number;
  title?: string;
};

const EditButton = ({ onClick, size = 15, title = "Editar" }: Props) => {
  return (
    <IconButton
      className="text-primary"
      onClick={(e) => {
        e.stopPropagation(); // 👈 evita que o clique vá pra linha
        onClick();
      }}
      title={title}
      size="small"
    >
      <Pencil size={size} />
    </IconButton>
  );
};

export default EditButton;
