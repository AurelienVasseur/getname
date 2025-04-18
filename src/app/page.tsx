import { Header } from "@/components/home/Header"
import { SearchForm } from "@/components/home/SearchForm"
import { Features } from "@/components/home/Features"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Trouvez le nom parfait pour votre projet
            </h2>
            <p className="text-xl text-muted-foreground">
              Vérifiez instantanément la disponibilité de votre nom de domaine et sur les réseaux sociaux
            </p>
            
            <SearchForm />
            <Features />
          </div>
        </section>
      </main>
    </div>
  )
}
