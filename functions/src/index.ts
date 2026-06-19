import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineString } from 'firebase-functions/params';
import { exchangeDiscordCode } from './discordAuth';
import { runDailyReminders } from './reminders';

admin.initializeApp();

const discordClientId = defineString('DISCORD_CLIENT_ID');
const discordClientSecret = defineString('DISCORD_CLIENT_SECRET');

export const discordAuth = onCall(async (request) => {
  const { code, redirectUri } = request.data as { code?: string; redirectUri?: string };

  if (!code || !redirectUri) {
    throw new HttpsError('invalid-argument', 'code and redirectUri are required');
  }

  try {
    const { customToken, discordUser } = await exchangeDiscordCode(
      code,
      redirectUri,
      discordClientId.value(),
      discordClientSecret.value(),
      (uid) => admin.auth().createCustomToken(uid),
    );

    const db = admin.firestore();
    const userRef = db.doc(`users/${`discord:${discordUser.id}`}`);
    await userRef.set(
      {
        discordId: discordUser.id,
        displayName: discordUser.username,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return { customToken, discordId: discordUser.id, username: discordUser.username };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    throw new HttpsError('internal', msg);
  }
});

export const dailyReminder = onSchedule('0 * * * *', async () => {
  await runDailyReminders(admin.firestore(), admin.messaging(), new Date());
});
