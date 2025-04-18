export interface SocialNetwork {
  name: string;
  url: string;
  icon?: string;
}

export interface SocialCheckResult {
  network: SocialNetwork;
  isAvailable: boolean;
  url?: string;
  error?: string;
}

export interface SocialCheckResponse {
  username: string;
  results: SocialCheckResult[];
  timestamp: string;
} 