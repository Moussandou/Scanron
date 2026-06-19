import { signInWithCustomToken } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { getFirebaseAuth, getFirebaseFunctions } from '../firebase/app';

export function getDiscordAuthUrl(redirectUri: string): string {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
  if (!clientId) {
    throw new Error('VITE_DISCORD_CLIENT_ID is not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify',
  });

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export async function signInWithDiscord(code: string, redirectUri: string): Promise<string> {
  const functions = getFirebaseFunctions();
  const auth = getFirebaseAuth();

  const discordAuthFn = httpsCallable<{ code: string; redirectUri: string }, { customToken: string }>(
    functions,
    'discordAuth',
  );

  const res = await discordAuthFn({ code, redirectUri });
  const { customToken } = res.data;

  const cred = await signInWithCustomToken(auth, customToken);
  return cred.user.uid;
}
