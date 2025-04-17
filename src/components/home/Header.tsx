import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">GetName</h1>
        <nav className="space-x-4">
          <Button variant="ghost">À propos</Button>
          <Button variant="ghost">Fonctionnalités</Button>
          <Button variant="ghost">Contact</Button>
        </nav>
      </div>
    </header>
  )
} 