export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")               // remove acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos de novo
    .replace(/\s+/g, "-")          // espaço vira hífen
    .replace(/[^\w\-]+/g, "")      // remove tudo que não for letra, número ou hífen
    .replace(/\-\-+/g, "-")        // vários hífens viram um só
    .replace(/^-+/, "")            // remove hífen no início
    .replace(/-+$/, "");           // remove hífen no fim
}
