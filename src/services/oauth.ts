/**
 * OAuth Service Integration
 * Handles OAuth flows for external services using backend-provided configuration
 */

import { areasAPI, oauthAPI } from '@/services/api';
import { getGoogleServiceAccessToken } from '@/services/google';
import type { Service, OAuthConfig } from '@/types/areas';

// Cache for service configurations
let servicesCache: Service[] | null = null;

/**
 * Get OAuth configuration for a specific service from backend
 */
export async function getServiceOAuthConfig(serviceName: string): Promise<Service | null> {
  //uncomment when backend is ready
  try {
    if (!servicesCache) {
      const aboutData = await areasAPI.about();
      servicesCache = aboutData.server?.services || [];
    }
    
    return servicesCache?.find(service => service.name === serviceName) || null;
  } catch (error) {
    console.error('Failed to get service OAuth config:', error);
    return null;
  }
  
  //test case
  // const mockServices: Service[] = [
  //   {
  //     name: 'google',
  //     display_name: 'Google Mail',
  //     requires_oauth: true,
  //     oauth_config: {
  //       scopes: [
  //         'https://www.googleapis.com/auth/userinfo.email',
  //         'https://www.googleapis.com/auth/userinfo.profile',
  //         'https://www.googleapis.com/auth/gmail.readonly',
  //         'https://www.googleapis.com/auth/gmail.send'
  //       ],
  //       auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
  //       token_url: 'https://oauth2.googleapis.com/token'
  //     },
  //     actions: [],
  //     reactions: []
  //   },
  //   {
  //     name: 'github',
  //     display_name: 'GitHub',
  //     requires_oauth: true,
  //     oauth_config: {
  //       scopes: ['repo', 'user:email'],
  //       auth_url: 'https://github.com/login/oauth/authorize',
  //       token_url: 'https://github.com/login/oauth/access_token'
  //     },
  //     actions: [],
  //     reactions: []
  //   }
  // ];
  
  // return mockServices.find(service => service.name === serviceName) || null;
}

/**
 * Start OAuth flow for a service
 * Uses service-specific configuration from backend
 */
export async function startOAuthFlow(serviceName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const serviceConfig = await getServiceOAuthConfig(serviceName);
    
    if (!serviceConfig) {
      return { success: false, error: `Service ${serviceName} not found` };
    }

    if (!serviceConfig.requires_oauth) {
      return { success: true }; // No OAuth needed
    }

    // Handle different OAuth flows based on service
    switch (serviceName) {
      case 'google':
        return await handleGoogleOAuth(serviceConfig);
      
      case 'github':
        return await handleGitHubOAuth(serviceConfig);
      
      case 'discord':
        return await handleDiscordOAuth(serviceConfig);
      
      default:
        console.log(`[MOCK] OAuth not implemented for ${serviceName}`);
        return { success: false, error: `OAuth not implemented for ${serviceName}` };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Handle Google OAuth using backend configuration
 */
async function handleGoogleOAuth(serviceConfig: Service): Promise<{ success: boolean; error?: string }> {
  try {
    const scopes = serviceConfig.oauth_config.scopes || [];
    
    // Get access token with backend-defined scopes
    const accessToken = await getGoogleServiceAccessToken(scopes, { 
      prompt: 'consent'
    });

    //when backend OAuth endpoints are ready
    // Send token to backend for validation and storage
    const result = await oauthAPI.completeOAuth('google', accessToken);
    return result
    // test case
    // console.log('[MOCK] Google OAuth completed, token:', accessToken.substring(0, 20) + '...');
    
    // return { success: true };
  } catch (error: any) {
    // Provide more helpful error messages
    let errorMessage = error.message;
    if (errorMessage.includes('access_denied') || errorMessage.includes('403')) {
      errorMessage = 'Accès Google refusé. Votre application doit être en mode test avec des utilisateurs autorisés. Contactez l\'administrateur pour ajouter votre email aux utilisateurs de test.';
    }
    return { success: false, error: errorMessage };
  }
}

/**
 * Handle GitHub OAuth using backend configuration
 */
async function handleGitHubOAuth(serviceConfig: Service): Promise<{ success: boolean; error?: string }> {
  try {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!clientId) {
      return { success: false, error: 'GitHub Client ID not configured' };
    }

    // Build authorization URL
    const scopes = serviceConfig.oauth_config.scopes?.join(' ') || 'repo user:email';
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('redirect_uri', `${window.location.origin}/oauth/callback/github`);

    // Store state for validation
    sessionStorage.setItem('github_oauth_state', state);

    // Open popup for OAuth
    const popup = window.open(
      authUrl.toString(),
      'github_oauth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    // Wait for popup completion
    return new Promise((resolve) => {
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          // Check if OAuth was successful
          const success = sessionStorage.getItem('oauth_success') === 'true';
          sessionStorage.removeItem('oauth_success');
          resolve({ success });
        }
      }, 1000);
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Handle Discord OAuth using backend configuration
 */
async function handleDiscordOAuth(serviceConfig: Service): Promise<{ success: boolean; error?: string }> {
  try {
    // Support both auth_url and authorization_url for backend compatibility
    const authorizationUrl = (serviceConfig.oauth_config as any)?.authorization_url || serviceConfig.oauth_config?.auth_url;
    
    if (!authorizationUrl) {
      return { success: false, error: 'Discord OAuth configuration missing' };
    }

    // Build authorization URL
    const authUrl = new URL(authorizationUrl);
    const state = Math.random().toString(36).substring(2, 15);
    
    authUrl.searchParams.set('client_id', import.meta.env.VITE_DISCORD_CLIENT_ID || '');
    authUrl.searchParams.set('redirect_uri', `${window.location.origin}/oauth/callback/discord`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', serviceConfig.oauth_config.scopes?.join(' ') || 'identify');
    authUrl.searchParams.set('state', state);

    // Store state for validation
    sessionStorage.setItem('discord_oauth_state', state);

    // Open popup for OAuth
    const popup = window.open(
      authUrl.toString(),
      'discord_oauth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    // Wait for popup completion
    return new Promise((resolve) => {
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          // Check if OAuth was successful
          const success = sessionStorage.getItem('oauth_success') === 'true';
          sessionStorage.removeItem('oauth_success');
          resolve({ success });
        }
      }, 1000);
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get OAuth connection status for all services
 */
export async function getOAuthConnectionStatus(): Promise<Record<string, any>> {
  //when backend is ready
  try {
    return await oauthAPI.getConnectionStatus();
  } catch (error) {
    console.error('Failed to get OAuth connection status:', error);
    return {};
  }
  
  //test case
  // return {
  //   google: { connected: false, details: null },
  //   github: { connected: false, details: null }
  // };
}

/**
 * Disconnect OAuth service
 */
export async function disconnectOAuthService(serviceName: string): Promise<{ success: boolean; error?: string }> {
  //when backend is ready
  try {
    await oauthAPI.disconnectService(serviceName);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
  
  // test case
  // console.log(`[MOCK] Disconnecting ${serviceName}`);
  // return { success: true };
}

/**
 * Get all services that require OAuth
 */
export async function getOAuthServices(): Promise<Service[]> {
  try {
    if (!servicesCache) {
      const aboutData = await areasAPI.about();
      servicesCache = aboutData.server?.services || [];
    }
    
    return servicesCache?.filter(service => service.requires_oauth) || [];
  } catch (error) {
    console.error('Failed to get OAuth services:', error);
    return [];
  }
}