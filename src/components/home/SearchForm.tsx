"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2, ExternalLink, Globe, Calendar } from "lucide-react"

interface WhoisDetails {
  registrar?: string
  creationDate?: string
  expirationDate?: string
  nameServers?: string[]
  status?: string[]
}

interface DomainAvailability {
  domain: string
  available: boolean
  loading: boolean
  details?: WhoisDetails
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
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      return {
        available: data.available,
        details: data.details
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.domain}</span>
                  {result.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : result.available ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-500">Disponible</span>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-red-500">Non disponible</span>
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {!result.loading && !result.available && result.details && (
                  <div className="text-sm text-muted-foreground space-y-2">
                    {result.details.registrar && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Registrar: {result.details.registrar}</span>
                      </div>
                    )}
                    {result.details.creationDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Créé le: {formatDate(result.details.creationDate)}</span>
                      </div>
                    )}
                    {result.details.expirationDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Expire le: {formatDate(result.details.expirationDate)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-2">
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