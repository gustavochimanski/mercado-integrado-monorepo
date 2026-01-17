import { z } from "zod";

// Tipos de imagem permitidos
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;

// Função para validar dimensões da imagem
export const validateImageDimensions = (file: File, maxWidth: number, maxHeight: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img.width <= maxWidth && img.height <= maxHeight);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    
    img.src = url;
  });
};

// Schema básico para validação de formato e tamanho (sem dimensões)
const baseImageSchema = z
  .instanceof(File, { message: "Arquivo de imagem é obrigatório" })
  .refine(
    (file) => ALLOWED_IMAGE_TYPES.includes(file.type as any),
    {
      message: "Formato de imagem inválido. Use apenas JPEG, JPG, PNG ou WEBP.",
    }
  );

// Schema para categoria (formato + tamanho, sem dimensões)
export const categoriaImageSchema = baseImageSchema
  .refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB
    {
      message: "Tamanho do arquivo muito grande. Máximo permitido: 5MB.",
    }
  );

// Schema para produto (formato + tamanho, sem dimensões)
export const produtoImageSchema = baseImageSchema
  .refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB
    {
      message: "Tamanho do arquivo muito grande. Máximo permitido: 5MB.",
    }
  );

// Função utilitária para validar imagem com feedback detalhado
export const validateImageWithFeedback = async (
  file: File | undefined,
  type: "categoria" | "produto"
): Promise<{ isValid: boolean; error?: string }> => {
  if (!file) {
    return { isValid: true }; // Imagem é opcional
  }

  // 1. Validar formato
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return { 
      isValid: false, 
      error: "Formato de imagem inválido. Use apenas JPEG, JPG, PNG ou WEBP." 
    };
  }

  // 2. Validar tamanho
  const maxSize = 5 * 1024 * 1024; // 5MB para categoria e produto
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: "Tamanho do arquivo muito grande. Máximo permitido: 5MB." 
    };
  }

  // 3. Validar dimensões de forma assíncrona
  try {
    const maxDimensions = type === "categoria" ? { width: 512, height: 512 } : { width: 1024, height: 1024 };
    const isValidDimensions = await validateImageDimensions(file, maxDimensions.width, maxDimensions.height);
    
    if (!isValidDimensions) {
      return { 
        isValid: false, 
        error: `Dimensões da imagem inválidas. Máximo permitido: ${maxDimensions.width}x${maxDimensions.height} pixels.` 
      };
    }

    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: "Erro ao validar dimensões da imagem. Tente novamente." 
    };
  }
};
