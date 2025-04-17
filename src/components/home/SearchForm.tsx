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
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const defaultExtensions = [".com", ".net", ".org", ".io"];
  const availableExtensions = [
    ".com", ".net", ".org", ".io", ".info", ".biz", ".me", ".co", ".app", ".dev",
    ".cloud", ".site", ".online", ".store", ".shop", ".blog", ".tech", ".ai", ".xyz", ".eu"
  ];

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
    setSelectedExtensions([...availableExtensions]);
  };

  const selectDefaultExtensions = () => {
    setSelectedExtensions([...defaultExtensions]);
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
    setShowExtensions(false);
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

    setIsSearching(false);
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
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 p-4 bg-muted/50 rounded-lg">
            {availableExtensions.map((extension) => (
              <label
                key={extension}
                className="flex items-center space-x-2 cursor-pointer hover:bg-muted/80 p-2 rounded"
              >
                <Checkbox
                  checked={selectedExtensions.includes(extension)}
                  onCheckedChange={() => toggleExtension(extension)}
                />
                <span className="text-sm">{extension}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {domainResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
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
        </div>
      )}
    </div>
  );
}
