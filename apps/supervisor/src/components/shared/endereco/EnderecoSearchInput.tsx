"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { Input } from "@supervisor/components/ui/input";
import { Label } from "@supervisor/components/ui/label";
import { useEnderecoSearch, EnderecoSuggestion } from "@supervisor/hooks/useEnderecoSearch";

interface EnderecoSearchInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onEnderecoSelected: (endereco: EnderecoSuggestion) => void;
  onInputChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export default function EnderecoSearchInput({
  label = "Buscar Endereço",
  placeholder = "Digite CEP ou endereço (ex: 01000-000 ou Rua Augusta, São Paulo)",
  value = "",
  onEnderecoSelected,
  onInputChange,
  disabled = false,
  required = false,
  error
}: EnderecoSearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const { suggestions, isLoading, error: searchError, search, clearSuggestions } = useEnderecoSearch();

  // Debounced search - mais rápido para busca em tempo real
  const debouncedSearch = useCallback((query: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      search(query);
    }, 150); // Reduzido de 300ms para 150ms para ser mais rápido
  }, [search]);

  // Função para formatar CEP automaticamente
  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  // Função para detectar se parece CEP
  const isPossibleCEP = (value: string): boolean => {
    const numbers = value.replace(/\D/g, "");
    return numbers.length >= 5 && numbers.length <= 8 && /^\d+$/.test(numbers);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Se parece ser CEP, formata automaticamente
    if (isPossibleCEP(newValue)) {
      newValue = formatCEP(newValue);
    }

    setInputValue(newValue);
    setSelectedIndex(-1);

    if (onInputChange) {
      onInputChange(newValue);
    }

    if (newValue.trim().length >= 2) {
      debouncedSearch(newValue);
      setIsOpen(true);
    } else {
      clearSuggestions();
      setIsOpen(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: EnderecoSuggestion) => {
    setInputValue(suggestion.display);
    setIsOpen(false);
    clearSuggestions();
    onEnderecoSelected(suggestion);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Clear input
  const clearInput = () => {
    setInputValue("");
    setIsOpen(false);
    clearSuggestions();
    if (onInputChange) {
      onInputChange("");
    }
    inputRef.current?.focus();
  };

  const showDropdown = isOpen && (suggestions.length > 0 || isLoading || searchError);

  return (
    <div className="relative w-full">
      {label && (
        <Label className="block mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`pl-10 pr-8 ${error ? 'border-red-500' : ''}`}
          />

          {inputValue && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto"
          >
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-gray-600">Buscando endereços...</span>
              </div>
            )}

            {searchError && (
              <div className="px-4 py-3 text-sm text-red-600 border-b">
                {searchError}
              </div>
            )}

            {!isLoading && suggestions.length > 0 && (
              <div className="py-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                      index === selectedIndex ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mt-0.5 mr-3 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.display}
                        </div>
                        {suggestion.cep && (
                          <div className="text-xs text-gray-500 mt-1">
                            CEP: {suggestion.cep}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!isLoading && !searchError && suggestions.length === 0 && inputValue.length >= 2 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                Nenhum endereço encontrado
                <div className="text-xs mt-1">
                  Tente buscar por CEP ou endereço completo
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <span className="text-red-500 text-sm mt-1 block">{error}</span>
      )}

      {!error && inputValue.length >= 1 && inputValue.length < 2 && (
        <span className="text-gray-500 text-xs mt-1 block">
          Digite pelo menos 2 caracteres para buscar
        </span>
      )}
    </div>
  );
}