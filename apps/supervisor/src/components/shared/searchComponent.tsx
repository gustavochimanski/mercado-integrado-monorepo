import * as React from "react"
import { Input } from "@supervisor/components/ui/input"
import { Button } from "@supervisor/components/ui/button"
import { Search } from "lucide-react" // ou outro ícone de sua preferência


interface SearchComponentProps {
  className?: string;
}

export function SearchComponent({ className }: SearchComponentProps) {
  return (
    <div className={`relative min-w-28 ${className || ""}`}>
      <Input
        type="search"
        placeholder="Pesquisar..."
        className="pr-10 h-8" // espaço extra à direita para o ícone
      />
      <Button 
        variant="ghost"
        className="absolute top-1/2 right-0 transform -translate-y-1/2 flex items-center px-2  "
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
