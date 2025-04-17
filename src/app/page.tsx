import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Trouvez le nom parfait pour votre projet
            </h2>
            <p className="text-xl text-muted-foreground">
              Vérifiez instantanément la disponibilité de votre nom de domaine et sur les réseaux sociaux
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <Input 
                type="text" 
                placeholder="Entrez le nom que vous souhaitez vérifier..." 
                className="h-12 text-lg"
              />
              <Button size="lg" className="h-12">
                Vérifier
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-12">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Noms de domaine</h3>
                <p className="text-sm text-muted-foreground">
                  Vérifiez la disponibilité sur les principales extensions (.com, .net, .org, etc.)
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Réseaux sociaux</h3>
                <p className="text-sm text-muted-foreground">
                  Trouvez votre nom sur Twitter, Instagram, Facebook et plus encore
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Marques déposées</h3>
                <p className="text-sm text-muted-foreground">
                  Vérifiez si le nom est déjà utilisé comme marque déposée
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
