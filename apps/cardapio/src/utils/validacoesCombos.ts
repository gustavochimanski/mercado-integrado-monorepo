/**
 * Validações de seleção de combos (frontend)
 *
 * Regras aplicadas:
 * - Para cada seção marcada obrigatorio=true, validar que foram selecionados pelo menos minimo_itens.
 * - A quantidade total de itens por seção deve ficar entre minimo_itens e maximo_itens.
 * - Se item tem permite_quantidade=false, quantidade do item deve ser 1; caso contrário é validada entre quantidade_min e quantidade_max.
 *
 * Inputs esperados:
 * - combo.secoes - Array de seções selecionadas no carrinho (opcional)
 * - sectionDefinitions - Array de seções definidas no combo (vinda do backend) com regras: id, obrigatorio, quantitativo, minimo_itens, maximo_itens, itens listando cada item com id, permite_quantidade, quantidade_min, quantidade_max
 *
 * Nota: Esta função não altera o estado do carrinho, apenas valida e retorna mensagens amigáveis.
 */
export type SectionDefinitionItem = {
  id: number;
  permite_quantidade?: boolean;
  quantidade_min?: number | null;
  quantidade_max?: number | null;
};

export type SectionDefinition = {
  id: number;
  obrigatorio?: boolean;
  quantitativo?: boolean;
  minimo_itens?: number | null;
  maximo_itens?: number | null;
  itens?: SectionDefinitionItem[];
};

export type CartComboSection = {
  secao_id: number;
  itens: Array<{ id: number; quantidade: number }>;
};

export function validarSelecoesCombo(
  comboId: number,
  secoesSelecionadas: CartComboSection[] | undefined,
  secoesDefinicao: SectionDefinition[] | undefined
): { valido: boolean; erro?: string } {
  // Se não há definição de seções no backend, nada a validar aqui
  if (!secoesDefinicao || secoesDefinicao.length === 0) {
    return { valido: true };
  }

  // Mapear definições por id para acesso rápido
  const defsById = new Map<number, SectionDefinition>();
  secoesDefinicao.forEach(s => defsById.set(s.id, s));

  // Mapear seleções por secao_id
  const selectsById = new Map<number, CartComboSection>();
  (secoesSelecionadas || []).forEach(s => selectsById.set(s.secao_id, s));

  // Para cada seção definida, validar regras
  for (const secDef of secoesDefinicao) {
    const sel = selectsById.get(secDef.id);

    const totalItensSelecionados = sel ? sel.itens.reduce((sum, it) => sum + (it.quantidade || 0), 0) : 0;

    // Obrigatório
    if (secDef.obrigatorio) {
      const minimo = secDef.minimo_itens ?? 1;
      if (totalItensSelecionados < minimo) {
        return {
          valido: false,
          erro: `No combo ${comboId}: é obrigatório selecionar ao menos ${minimo} item(s) na seção ${secDef.id}.`,
        };
      }
    }

    // Minimo / Maximo por seção
    if (secDef.minimo_itens && totalItensSelecionados < secDef.minimo_itens) {
      return {
        valido: false,
        erro: `No combo ${comboId}: seleções na seção ${secDef.id} abaixo do mínimo (${secDef.minimo_itens}).`,
      };
    }
    if (secDef.maximo_itens && totalItensSelecionados > secDef.maximo_itens) {
      return {
        valido: false,
        erro: `No combo ${comboId}: seleções na seção ${secDef.id} acima do máximo (${secDef.maximo_itens}).`,
      };
    }

    // Validar cada item da seleção em relação à definição do item (se houver)
    if (sel && sel.itens && secDef.itens && secDef.itens.length > 0) {
      const itemDefById = new Map<number, SectionDefinitionItem>();
      secDef.itens.forEach(it => itemDefById.set(it.id, it));

      for (const it of sel.itens) {
        const def = itemDefById.get(it.id);
        if (!def) {
          return { valido: false, erro: `No combo ${comboId}: item ${it.id} inexistente na seção ${secDef.id}.` };
        }

        const qtd = it.quantidade ?? 0;
        if (def.permite_quantidade === false) {
          if (qtd !== 1) {
            return { valido: false, erro: `No combo ${comboId}: o item ${it.id} na seção ${secDef.id} não permite quantidade (deve ser 1).` };
          }
        } else {
          const min = def.quantidade_min ?? 1;
          const max = def.quantidade_max ?? Number.POSITIVE_INFINITY;
          if (qtd < min || qtd > max) {
            return { valido: false, erro: `No combo ${comboId}: quantidade do item ${it.id} na seção ${secDef.id} deve estar entre ${min} e ${isFinite(max) ? max : '∞'}.` };
          }
        }
      }
    }
  }

  return { valido: true };
}

