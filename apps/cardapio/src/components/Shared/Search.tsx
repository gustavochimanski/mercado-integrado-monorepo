import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Search } from "lucide-react"

export function SearchBarComponent() {
  return (
    <form className="flex w-full max-w-md gap-2">
      <Input
        type="search"
        placeholder="Buscar produtos, categorias..."
        className="flex-1 rounded-3xl  placeholder:text-primary"
        aria-label="Buscar"
      />
      <Button type="submit"  className="rounded-3xl">
        <Search   size={18} />
      </Button>
    </form>
  )
}
