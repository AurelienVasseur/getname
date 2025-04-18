export interface SocialNetwork {
  name: string;
  url: string;
  icon?: string;
  errorType: 'status_code' | 'message';
  errorMsg: string;
  regexCheck: string;
  urlMain: string;
  isCheckAvailable: boolean;
}

export interface SocialCheckResult {
  network: SocialNetwork;
  isAvailable: boolean;
  url?: string;
  error?: string;
  isCheckEnabled: boolean;
  loading?: boolean;
}

export interface SocialCheckResponse {
  username: string;
  results: SocialCheckResult[];
  timestamp: string;
} 