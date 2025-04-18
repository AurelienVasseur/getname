import { SocialNetwork } from '@/types/social';

export const socialNetworks: SocialNetwork[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/{username}',
    errorType: 'status_code',
    errorMsg: '404',
    regexCheck: '^[a-zA-Z0-9-]+$',
    urlMain: 'https://github.com',
    icon: 'github',
    isCheckAvailable: true
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/{username}',
    errorType: 'status_code',
    errorMsg: '404',
    regexCheck: '^[A-Za-z0-9_]{1,15}$',
    urlMain: 'https://twitter.com',
    icon: 'twitter',
    isCheckAvailable: false
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/{username}',
    errorType: 'message',
    errorMsg: 'Sorry, this page isn\'t available',
    regexCheck: '^(?!.*\\.\\.)(?!.*\\.$)[^\\W][\\w.]{0,29}$',
    urlMain: 'https://www.instagram.com',
    icon: 'instagram',
    isCheckAvailable: false
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/{username}',
    errorType: 'message',
    errorMsg: 'Page not found',
    regexCheck: '^[a-zA-Z0-9-]{3,100}$',
    urlMain: 'https://www.linkedin.com',
    icon: 'linkedin',
    isCheckAvailable: false
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/{username}',
    errorType: 'status_code',
    errorMsg: '404',
    regexCheck: '^[a-zA-Z0-9\\.]{3,50}$',
    urlMain: 'https://www.facebook.com',
    icon: 'facebook',
    isCheckAvailable: false
  }
]; 