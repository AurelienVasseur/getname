"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DisclaimerModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm text-muted-foreground hover:text-primary">
          Disclaimer
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Disclaimer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Les informations fournies par ce service sont à titre informatif et indicatif uniquement. 
            Bien que nous utilisions plusieurs sources de données (WHOIS, DNS, etc.) pour effectuer 
            nos vérifications, nous ne pouvons garantir une fiabilité à 100%.
          </p>
          <p className="text-sm text-muted-foreground">
            Notre système effectue des vérifications basées sur :
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li>Les données WHOIS des domaines</li>
            <li>Les enregistrements DNS</li>
            <li>Les informations de propriété des noms de domaine</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Ces données peuvent être incomplètes, inexactes ou ne pas refléter la situation actuelle. 
            Nous vous recommandons de toujours vérifier ces informations auprès des sources officielles 
            ou des registrars concernés.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 