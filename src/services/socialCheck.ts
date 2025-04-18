import { SocialNetwork, SocialCheckResult, SocialCheckResponse } from '@/types/social';
import { socialNetworks } from '@/config/socialNetworks';

export class SocialCheckService {
  private static async checkNetwork(network: SocialNetwork, username: string): Promise<SocialCheckResult> {
    if (!network.isCheckAvailable) {
      return {
        network,
        isAvailable: false,
        isCheckEnabled: false
      };
    }

    try {
      const url = network.url.replace('{username}', username);
      const response = await fetch(`/api/social-check?${new URLSearchParams({
        url: url,
        username: username,
        errorType: network.errorType,
        errorMsg: network.errorMsg,
        regexCheck: network.regexCheck
      }).toString()}`);
      
      const data = await response.json();
      
      return {
        network,
        isAvailable: data.available,
        url: !data.available ? url : undefined,
        error: data.error,
        isCheckEnabled: true
      };
    } catch (error) {
      return {
        network,
        isAvailable: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        isCheckEnabled: true
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