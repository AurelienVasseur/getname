"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Globe,
  Calendar,
  AlertCircle,
  RefreshCw,
  Settings,
  Plus,
  X,
  Clock,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SocialCheckResponse } from "@/types/social";
import { SocialCheckService } from "@/services/socialCheck";
import { socialNetworks } from "@/config/socialNetworks";

interface WhoisDetails {
  registrar?: string;
  creationDate?: string;
  expirationDate?: string;
  nameServers?: string[];
  status?: string[];
}

interface DomainAvailability {
  domain: string;
  available: boolean;
  loading: boolean;
  error?: string;
  details?: WhoisDetails;
}

export function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [domainResults, setDomainResults] = useState<DomainAvailability[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([".com", ".net", ".org", ".io"]);
  const [showExtensions, setShowExtensions] = useState(false);
  const [customExtension, setCustomExtension] = useState("");
  const [customExtensions, setCustomExtensions] = useState<string[]>([]);
  const [socialResults, setSocialResults] = useState<SocialCheckResponse | null>(null);
  const [isCheckingSocial, setIsCheckingSocial] = useState(false);

  const defaultExtensions = [".com", ".net", ".org", ".io"];
  const availableExtensions = [
    ".com", ".net", ".org", ".io", ".info", ".biz", ".me", ".co", ".app", ".dev",
    ".cloud", ".site", ".online", ".store", ".shop", ".blog", ".tech", ".ai", ".xyz", ".eu"
  ];

  const allExtensions = [...availableExtensions, ...customExtensions];

  const toggleExtension = (extension: string) => {
    setSelectedExtensions(prev => {
      if (prev.includes(extension)) {
        return prev.filter(ext => ext !== extension);
      } else {
        return [...prev, extension];
      }
    });
  };

  const selectAllExtensions = () => {
    setSelectedExtensions([...allExtensions]);
  };

  const selectDefaultExtensions = () => {
    setSelectedExtensions([...defaultExtensions]);
  };

  const addCustomExtension = () => {
    if (!customExtension) return;
    
    // Vérifier si l'extension commence par un point
    const extension = customExtension.startsWith(".") ? customExtension : `.${customExtension}`;
    
    // Vérifier si l'extension n'existe pas déjà
    if (!allExtensions.includes(extension)) {
      setCustomExtensions(prev => [...prev, extension]);
      setCustomExtension("");
    }
  };

  const removeCustomExtension = (extension: string) => {
    setCustomExtensions(prev => prev.filter(ext => ext !== extension));
    setSelectedExtensions(prev => prev.filter(ext => ext !== extension));
  };

  const checkDomainAvailability = async (fullDomain: string) => {
    const domainParts = fullDomain.split(".");
    const zone = domainParts.pop(); // Obtient l'extension (.com, .net, etc.)
    const searchTerm = domainParts.join("."); // Obtient le nom du domaine

    const response = await fetch(
      `/api/check-domain?domain=${searchTerm}&zone=${zone}`
    );

    if (!response.ok) {
      throw new Error("Failed to check domain availability");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      available: data.available,
      details: data.details,
    };
  };

  const checkSingleDomain = async (domain: string, index: number) => {
    setDomainResults((prev) => {
      const newResults = [...prev];
      newResults[index] = {
        ...newResults[index],
        loading: true,
        error: undefined,
      };
      return newResults;
    });

    try {
      const result = await checkDomainAvailability(domain);
      setDomainResults((prev) => {
        const newResults = [...prev];
        newResults[index] = {
          ...newResults[index],
          available: result.available,
          loading: false,
          error: undefined,
          details: result.details,
        };
        return newResults;
      });
    } catch {
      setDomainResults((prev) => {
        const newResults = [...prev];
        newResults[index] = {
          ...newResults[index],
          loading: false,
          error: "Erreur lors de la vérification",
        };
        return newResults;
      });
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) return;

    setIsSearching(true);
    setIsCheckingSocial(true);
    setShowExtensions(false);
    
    // Initialiser les résultats des domaines
    const results: DomainAvailability[] = [];
    for (const ext of selectedExtensions) {
      const domain = searchTerm.toLowerCase() + ext;
      results.push({
        domain,
        available: false,
        loading: true,
      });
    }
    setDomainResults(results);

    // Initialiser les résultats des réseaux sociaux avec état de chargement
    setSocialResults({
      username: searchTerm,
      results: socialNetworks.map(network => ({
        network,
        isAvailable: false,
        isCheckEnabled: network.isCheckAvailable,
        loading: true
      })),
      timestamp: new Date().toISOString()
    });

    // Vérification des noms de domaine
    for (let i = 0; i < results.length; i++) {
      try {
        const result = await checkDomainAvailability(results[i].domain);
        setDomainResults((prev) => {
          const newResults = [...prev];
          newResults[i] = {
            ...newResults[i],
            available: result.available,
            loading: false,
            details: result.details,
          };
          return newResults;
        });
      } catch {
        setDomainResults((prev) => {
          const newResults = [...prev];
          newResults[i] = {
            ...newResults[i],
            loading: false,
            error: "Erreur lors de la vérification",
          };
          return newResults;
        });
      }
    }

    // Vérification des réseaux sociaux
    try {
      const socialResponse = await SocialCheckService.checkUsername(searchTerm);
      setSocialResults(socialResponse);
    } catch (error) {
      console.error('Error checking social networks:', error);
      // En cas d'erreur, on met à jour les résultats avec l'erreur
      setSocialResults(prev => prev ? {
        ...prev,
        results: prev.results.map(result => ({
          ...result,
          loading: false,
          error: "Erreur lors de la vérification"
        }))
      } : null);
    }

    setIsSearching(false);
    setIsCheckingSocial(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Entrez le nom que vous souhaitez vérifier..."
            className="h-12 text-lg pr-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowExtensions(!showExtensions)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
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
            "Vérifier"
          )}
        </Button>
      </div>

      {showExtensions && (
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllExtensions}
              className="text-xs"
            >
              Tout sélectionner
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={selectDefaultExtensions}
              className="text-xs"
            >
              Extensions par défaut
            </Button>
          </div>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Ajouter une extension (ex: .fr)"
              value={customExtension}
              onChange={(e) => setCustomExtension(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomExtension()}
              className="h-9"
            />
            <Button
              size="sm"
              onClick={addCustomExtension}
              disabled={!customExtension}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 p-4 bg-muted/50 rounded-lg">
            {allExtensions.map((extension) => (
              <label
                key={extension}
                className="flex items-center space-x-2 cursor-pointer hover:bg-muted/80 p-2 rounded group"
              >
                <Checkbox
                  checked={selectedExtensions.includes(extension)}
                  onCheckedChange={() => toggleExtension(extension)}
                />
                <span className="text-sm flex-1">{extension}</span>
                {customExtensions.includes(extension) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault();
                      removeCustomExtension(extension);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {(domainResults.length > 0 || isCheckingSocial || socialResults) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Résultats des domaines */}
          {domainResults.map((result, index) => (
            <Card
              key={result.domain}
              className={`p-4 ${
                result.error
                  ? "opacity-90 cursor-pointer hover:opacity-100 transition-opacity"
                  : ""
              }`}
              onClick={() =>
                result.error && checkSingleDomain(result.domain, index)
              }
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.domain}</span>
                  {result.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : result.error ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 text-yellow-600 hover:text-yellow-500 transition-colors">
                            <AlertCircle className="h-5 w-5" />
                            <RefreshCw className="h-4 w-4" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Erreur lors de la vérification. Cliquez pour réessayer.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                {!result.loading &&
                  !result.error &&
                  !result.available &&
                  result.details && (
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
                          <span>
                            Créé le: {formatDate(result.details.creationDate)}
                          </span>
                        </div>
                      )}
                      {result.details.expirationDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Expire le:{" "}
                            {formatDate(result.details.expirationDate)}
                          </span>
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

          {/* Résultats des réseaux sociaux */}
          {isCheckingSocial && !socialResults && socialNetworks.map((network) => (
            <Card 
              key={network.name} 
              className={`p-4 col-span-2 ${!network.isCheckAvailable ? 'opacity-60' : ''}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">@{searchTerm}</span>
                    <span className="text-sm text-muted-foreground">sur {network.name}</span>
                  </div>
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            </Card>
          ))}

          {socialResults && socialResults.results.map((result) => (
            <Card 
              key={result.network.name} 
              className={`p-4 col-span-2 ${!result.network.isCheckAvailable ? 'opacity-60 hover:opacity-70 transition-opacity' : ''}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">@{socialResults.username}</span>
                    <span className="text-sm text-muted-foreground">sur {result.network.name}</span>
                  </div>
                  {result.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : result.network.isCheckAvailable ? (
                    result.isAvailable ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-500">Disponible</span>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                    ) : result.error ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-yellow-600">Erreur</span>
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-500">Non disponible</span>
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Bientôt disponible</span>
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {!result.loading && result.url && (
                  <div className="flex items-center gap-2 pt-2">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline inline-flex items-center text-sm"
                    >
                      Voir le profil
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {isCheckingSocial && domainResults.length === 0 && !socialResults && (
        <div className="flex justify-center mt-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
}
