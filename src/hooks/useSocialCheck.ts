import { useState } from 'react';
import { SocialCheckResponse } from '@/types/social';
import { SocialCheckService } from '@/services/socialCheck';

export function useSocialCheck() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SocialCheckResponse | null>(null);

  const checkUsername = async (username: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await SocialCheckService.checkUsername(username);
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    results,
    checkUsername
  };
} 