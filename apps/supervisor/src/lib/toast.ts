import { toast } from "sonner";

export const toastErro = (mensagem: string) => {
  toast.error(mensagem, {
    icon: "❌",
  });
};


export const toastSucess = (mensagem: string) => {
  toast.success(mensagem, {
    icon: "✅",
  });
};

export const toastInfo = (mensagem: string) => {
  toast(mensagem, {
    icon: "ℹ️",
  });
};


export const toastAlert = (mensagem: string) => {
  toast(mensagem, {
    icon: "⚠️",
  });
};
