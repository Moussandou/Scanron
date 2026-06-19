const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';
const DISCORD_USER_URL = 'https://discord.com/api/users/@me';

export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
}

type CreateCustomToken = (uid: string) => Promise<string>;

export async function exchangeDiscordCode(
  code: string,
  redirectUri: string,
  clientId: string,
  clientSecret: string,
  createCustomToken: CreateCustomToken,
): Promise<{ customToken: string; discordUser: DiscordUser }> {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });

  const tokenRes = await fetch(DISCORD_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!tokenRes.ok) {
    const body = await tokenRes.text();
    throw new Error(`Discord token exchange failed (${tokenRes.status}): ${body}`);
  }

  const tokenData: DiscordTokenResponse = await tokenRes.json();

  const userRes = await fetch(DISCORD_USER_URL, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userRes.ok) {
    throw new Error(`Discord user fetch failed (${userRes.status})`);
  }

  const discordUser: DiscordUser = await userRes.json();

  const firebaseUid = `discord:${discordUser.id}`;
  const customToken = await createCustomToken(firebaseUid);

  return { customToken, discordUser };
}
