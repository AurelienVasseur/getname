import { Card } from "@/components/ui/card"

export function Features() {
  return (
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
  )
} 