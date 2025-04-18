import { SocialNetwork, SocialCheckResult, SocialCheckResponse } from '@/types/social';
import { socialNetworks } from '@/config/socialNetworks';

export class SocialCheckService {
  private static async checkNetwork(network: SocialNetwork, username: string): Promise<SocialCheckResult> {
    try {
      const url = network.url.replace('{username}', username);
      const response = await fetch(`/api/social-check?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      return {
        network,
        isAvailable: data.available,
        url: !data.available ? url : undefined,
        error: data.error
      };
    } catch (error) {
      return {
        network,
        isAvailable: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public static async checkUsername(username: string): Promise<SocialCheckResponse> {
    const results = await Promise.all(
      socialNetworks.map(network => this.checkNetwork(network, username))
    );

    return {
      username,
      results,
      timestamp: new Date().toISOString()
    };
  }
} 