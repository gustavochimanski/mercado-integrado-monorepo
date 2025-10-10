import { useState, useCallback, useRef } from "react";
import { mensuraApi } from "@supervisor/api/MensuraApi";
import { EnderecoSuggestion, UseEnderecoSearchReturn } from "@supervisor/types/configuracoes/regiaoEntrega";

// Hook personalizado para busca de endereços
export function useEnderecoSearch(): UseEnderecoSearchReturn {
  const [suggestions, setSuggestions] = useState<EnderecoSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Função para detectar se é CEP (aceita com ou sem hífen)
  const isCEP = (text: string): boolean => {
    const cleanText = text.replace(/\D/g, "");
    return cleanText.length === 8;
  };

  // Função para normalizar CEP (remove hífen e outros caracteres)
  const normalizeCEP = (cep: string): string => {
    return cep.replace(/\D/g, "");
  };

  // Fallback para ViaCEP (caso a API principal falhe)
  const searchViaCEP = useCallback(async (cep: string): Promise<EnderecoSuggestion[]> => {
    try {
      const cleanCEP = normalizeCEP(cep);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (!data.erro) {
        return [{
          id: `viacep-${cleanCEP}`,
          display: `${data.logradouro || ''} - ${data.bairro}, ${data.localidade}/${data.uf}`,
          cep: data.cep,
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          uf: data.uf || '',
          formatted: `${data.logradouro || ''}, ${data.bairro}, ${data.localidade}/${data.uf}`
        }];
      }
    } catch (error) {
      console.warn("ViaCEP fallback failed:", error);
    }
    return [];
  }, []);

  // Busca principal usando Geoapify do backend
  const searchGeoapify = useCallback(async (query: string): Promise<EnderecoSuggestion[]> => {
    try {
      const response = await mensuraApi.geoapify.searchEnderecoApiMensuraGeoapifySearchEnderecoGet(query);

      if (response && Array.isArray(response)) {
        return response.map((item: any, index: number) => ({
          id: item.place_id || `geoapify-${index}`,
          display: item.endereco_formatado || `${item.logradouro || ''} ${item.numero || ''} - ${item.bairro || ''}, ${item.cidade || ''}/${item.codigo_estado || item.estado || ''}`,
          cep: item.cep || '',
          bairro: item.bairro || item.distrito || '',
          cidade: item.cidade || '',
          uf: item.codigo_estado || item.estado || '',
          latitude: item.latitude,
          longitude: item.longitude,
          formatted: item.endereco_formatado
        }));
      }

      // Se não é array, tenta como objeto único
      if (response && typeof response === 'object') {
        return [{
          id: response.place_id || 'geoapify-single',
          display: response.endereco_formatado || `${response.logradouro || ''} ${response.numero || ''} - ${response.bairro || ''}, ${response.cidade || ''}/${response.codigo_estado || response.estado || ''}`,
          cep: response.cep || '',
          bairro: response.bairro || response.distrito || '',
          cidade: response.cidade || '',
          uf: response.codigo_estado || response.estado || '',
          latitude: response.latitude,
          longitude: response.longitude,
          formatted: response.endereco_formatado
        }];
      }

    } catch (error) {
      console.warn("Geoapify search failed:", error);
    }
    return [];
  }, []);

  const search = useCallback(async (query: string) => {
    
    // Cancelar busca anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Limpar se query muito pequena
    if (!query || query.trim().length < 2) { 
      setSuggestions([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();
    
    // Estratégia híbrida de busca
    try {
      let results: EnderecoSuggestion[] = [];
      
      // Se parece ser um CEP, tenta primeiro Geoapify (mais completo) e depois ViaCEP
      if (isCEP(query)) {        
        const normalizedQuery = normalizeCEP(query);
        results = await searchGeoapify(normalizedQuery);

        // Se Geoapify não retornar nada, tenta ViaCEP
        if (results.length === 0) {
          results = await searchViaCEP(normalizedQuery);
        }
      } else {        
        results = await searchGeoapify(query);
      }

      // Se não achou nada e parece ser CEP, tenta ViaCEP como último recurso
      if (results.length === 0 && isCEP(query)) {
        const normalizedQuery = normalizeCEP(query);
        results = await searchViaCEP(normalizedQuery);
      }

      setSuggestions(results);

      // Se ainda nada, mostra mensagem
      if (results.length === 0) {
        setError("Nenhum endereço encontrado");
      }

      // Se muitos resultados, sugere refinar a busca
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Erro na busca de endereço:", error);
        setError("Erro ao buscar endereço. Tente novamente.");
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [searchViaCEP, searchGeoapify]);

  // Função para limpar sugestões e abortar requisição
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    search,
    clearSuggestions
  };
}