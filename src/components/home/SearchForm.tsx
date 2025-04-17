"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react"

interface DomainInfo {
  domain: string
  create_date: string
  country: string | null
  isDead: string
}

interface DomainAvailability {
  domain: string
  available: boolean
  loading: boolean
  details?: {
    createDate?: string
    country?: string
    isDead?: boolean
  }
}

export function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("")
  const [domainResults, setDomainResults] = useState<DomainAvailability[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkDomainAvailability = async (fullDomain: string) => {
    try {
      const domainParts = fullDomain.split('.')
      const zone = domainParts.pop() // Obtient l'extension (.com, .net, etc.)
      const searchTerm = domainParts.join('.') // Obtient le nom du domaine

      const response = await fetch(`/api/check-domain?domain=${searchTerm}&zone=${zone}`)
      
      if (!response.ok) {
        throw new Error('Failed to check domain availability')
      }

      const data = await response.json()
      
      // Vérifie si un domaine correspond exactement à notre recherche
      const exactMatch = data.domains?.find((d: DomainInfo) => 
        d.domain.toLowerCase() === fullDomain.toLowerCase()
      )
      
      return {
        available: !exactMatch,
        details: exactMatch ? {
          createDate: exactMatch.create_date,
          country: exactMatch.country || undefined,
          isDead: exactMatch.isDead === "True"
        } : undefined
      }
    } catch (error) {
      console.error('Error checking domain availability:', error)
      setError("Une erreur est survenue lors de la vérification du domaine.")
      return { available: false }
    }
  }

  const handleSearch = async () => {
    if (!searchTerm) return

    setIsSearching(true)
    setError(null)
    const extensions = ['.com', '.net', '.org', '.io']
    const results: DomainAvailability[] = []

    for (const ext of extensions) {
      const domain = searchTerm.toLowerCase() + ext
      results.push({
        domain,
        available: false,
        loading: true
      })
    }

    setDomainResults(results)

    for (let i = 0; i < results.length; i++) {
      const result = await checkDomainAvailability(results[i].domain)
      setDomainResults(prev => {
        const newResults = [...prev]
        newResults[i] = {
          ...newResults[i],
          available: result.available,
          loading: false,
          details: result.details
        }
        return newResults
      })
    }

    setIsSearching(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <Input 
          type="text" 
          placeholder="Entrez le nom que vous souhaitez vérifier..." 
          className="h-12 text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button 
          size="lg" 
          className="h-12"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification...
            </>
          ) : (
            'Vérifier'
          )}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      {domainResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {domainResults.map((result) => (
            <Card key={result.domain} className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.domain}</span>
                  {result.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : result.available ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                {!result.loading && !result.available && result.details && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    {result.details.createDate && (
                      <p>Créé le: {new Date(result.details.createDate).toLocaleDateString()}</p>
                    )}
                    {result.details.country && <p>Pays: {result.details.country}</p>}
                    <div className="flex items-center gap-2">
                      <a 
                        href={`https://${result.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline inline-flex items-center"
                      >
                        Visiter le site
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 