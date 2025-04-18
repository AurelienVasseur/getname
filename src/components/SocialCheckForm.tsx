"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialCheckResults } from './SocialCheckResults';
import { useSocialCheck } from '@/hooks/useSocialCheck';

export function SocialCheckForm() {
  const [username, setUsername] = useState('');
  const { loading, error, results, checkUsername } = useSocialCheck();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      checkUsername(username.trim());
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vérifier la disponibilité d&apos;un nom d&apos;utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              type="text"
              placeholder="Nom d&apos;utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Vérification...' : 'Vérifier'}
            </Button>
          </form>
          {error && (
            <p className="mt-4 text-sm text-red-500">{error}</p>
          )}
        </CardContent>
      </Card>

      {results && <SocialCheckResults results={results} />}
    </div>
  );
} 