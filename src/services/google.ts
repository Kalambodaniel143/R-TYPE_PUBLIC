const GIS_SRC = 'https://accounts.google.com/gsi/client';

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('No window')); 
    if ((window as any).google && (window as any).google.accounts) return resolve();

    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google script')));
      return;
    }

    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(script);
  });
}

export async function getGoogleAccessToken(options: { prompt?: 'consent' | 'none' } = { prompt: 'consent' }): Promise<string> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('VITE_GOOGLE_CLIENT_ID is not defined in environment variables');

  await loadScript();

  return new Promise((resolve, reject) => {
    try {
      // Basic scopes for AREA authentication
      const scope = 'openid email profile';

      // token client from GIS
      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope,
        callback: (response: any) => {
          // response: { access_token, expires_in, scope, token_type, error }
          if (response.error) {
            reject(new Error(`Google OAuth error: ${response.error}`));
          } else if (response && response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('No access token returned from Google'));
          }
        },
      });

      // Request the access token, will open a popup unless silent
      tokenClient.requestAccessToken({ prompt: options.prompt });
    } catch (err) {
      reject(err);
    }
  });
}

export async function getGoogleServiceAccessToken(customScopes: string[], options: { prompt?: 'consent' | 'none' } = { prompt: 'consent' }): Promise<string> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('VITE_GOOGLE_CLIENT_ID is not defined in environment variables');

  await loadScript();

  return new Promise((resolve, reject) => {
    try {
      // Use provided scopes for service access
      const scope = customScopes.join(' ');

      // token client from GIS
      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope,
        callback: (response: any) => {
          // response: { access_token, expires_in, scope, token_type, error }
          if (response.error) {
            reject(new Error(`Google OAuth error: ${response.error}`));
          } else if (response && response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('No access token returned from Google'));
          }
        },
      });

      // Request the access token, will open a popup unless silent
      tokenClient.requestAccessToken({ prompt: options.prompt });
    } catch (err) {
      reject(err);
    }
  });
}
