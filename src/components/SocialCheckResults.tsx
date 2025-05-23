import React from 'react';
import { SocialCheckResponse } from '@/types/social';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

interface SocialCheckResultsProps {
  results: SocialCheckResponse;
}

export function SocialCheckResults({ results }: SocialCheckResultsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Results for @{results.username}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {results.results.map((result) => (
            <div
              key={result.network.name}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{result.network.name}</span>
                {result.network.isCheckAvailable ? (
                  result.isAvailable ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Available
                    </Badge>
                  ) : result.error ? (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Error
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Not available
                    </Badge>
                  )
                ) : (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Coming soon
                  </Badge>
                )}
              </div>
              {result.url && (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  View profile
                </a>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 