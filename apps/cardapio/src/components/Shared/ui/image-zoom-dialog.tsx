"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@cardapio/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageZoomDialogProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  trigger?: React.ReactNode;
  priority?: boolean;
}

export function ImageZoomDialog({
  src,
  alt,
  className,
  imageClassName,
  trigger,
  priority = false,
}: ImageZoomDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger - se customizado, usa o trigger, senão usa a imagem padrão */}
      {trigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <div
          onClick={() => setOpen(true)}
          className={cn(
            "relative group cursor-pointer overflow-hidden",
            className
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className={cn(
              "object-contain transition-transform duration-300 group-hover:scale-110",
              imageClassName
            )}
          />
          {/* Overlay com ícone de zoom */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      )}

      {/* Dialog com imagem expandida */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-full !max-w-md h-auto max-h-[95vh] pt-14 pb-4 px-4 bg-black/95 border-none overflow-hidden"
          showCloseButton={false}
        >
          <VisuallyHidden>
            <DialogTitle>{alt}</DialogTitle>
          </VisuallyHidden>

          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 z-50 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="relative w-full aspect-square max-h-[85vh] flex items-center justify-center">
            <Image
              src={src}
              alt={alt}
              fill
              priority
              className="object-contain"
              sizes="448px"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
