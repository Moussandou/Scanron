import * as admin from 'firebase-admin';
import QRCode from 'qrcode';

const WHEEL = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T'] as const;

function encodeTimestamp(ms: number): string {
  return ms
    .toString(16)
    .split('')
    .map((c) => WHEEL[parseInt(c, 16)])
    .join('');
}

export function searchCode(friendCode: string, at: number = Date.now()): string {
  return `${friendCode}${encodeTimestamp(at)}`;
}

export function qrPayload(friendCode: string, at: number = Date.now()): string {
  return `4,${searchCode(friendCode, at)}`;
}

interface NotificationSettings {
  discord: boolean;
  push: boolean;
  sendAtHour: number;
  timezone: string;
}

interface UserDoc {
  displayName: string;
  discordWebhook?: string;
  fcmTokens?: string[];
  notificationSettings?: NotificationSettings;
}

export async function runDailyReminders(
  db: admin.firestore.Firestore,
  messaging: admin.messaging.Messaging,
  now: Date,
): Promise<void> {
  const usersSnapshot = await db.collection('users').get();

  for (const userDoc of usersSnapshot.docs) {
    const uid = userDoc.id;
    const userData = userDoc.data() as UserDoc;
    const settings = userData.notificationSettings;

    if (!settings) continue;
    if (!settings.discord && !settings.push) continue;

    // Resolve date and hour in user's timezone
    let dateStr: string;
    let userLocalHour: number;
    const tz = settings.timezone || 'UTC';

    try {
      const dFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      dateStr = dFormatter.format(now);

      const hFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: tz,
      });
      userLocalHour = parseInt(hFormatter.format(now), 10);
    } catch (e) {
      // Timezone fallback to UTC
      const dFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      dateStr = dFormatter.format(now);

      const hFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: 'UTC',
      });
      userLocalHour = parseInt(hFormatter.format(now), 10);
    }

    if (userLocalHour !== settings.sendAtHour) continue;

    // Idempotency check
    const logRef = db.doc(`users/${uid}/reminderLog/${dateStr}`);
    const logSnap = await logRef.get();
    if (logSnap.exists) continue;

    try {
      // Fetch active/first account
      const accountsSnap = await db.collection(`users/${uid}/accounts`).orderBy('order').get();
      if (accountsSnap.empty) continue;
      const activeAccount = accountsSnap.docs[0];

      // Fetch friends
      const friendsSnap = await db.collection(`users/${uid}/accounts/${activeAccount.id}/friends`).get();

      const friendsData = friendsSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          name: data.name as string,
          friendCode: data.friendCode as string,
          searchCode: searchCode(data.friendCode, now.getTime()),
          payload: qrPayload(data.friendCode, now.getTime()),
        };
      });

      // Send via enabled channels
      let discordSent = false;
      let pushSent = false;

      // 1. Discord Webhook Channel
      if (settings.discord && userData.discordWebhook) {
        try {
          const formData = new FormData();
          const payloadJson: any = {
            content: `☄️ **Daily Dragon Radar Scan Complete!** (Account: *${activeAccount.data().name}*)`,
            embeds: [] as any[],
          };

          if (friendsData.length === 0) {
            payloadJson.embeds.push({
              title: 'No Friends Found',
              description: 'You have not added any friends to this account yet. Go to Scanron to add friends!',
              color: 16104995, // amber highlight (#f5a623 in dec is 16100131 but close enough)
            });
          } else {
            for (let i = 0; i < friendsData.length; i++) {
              const friend = friendsData[i];
              const fileName = `qr_${i}.png`;

              payloadJson.embeds.push({
                title: `Friend: ${friend.name}`,
                description: `**Search Code:** \`${friend.searchCode}\`\n**Friend Code:** \`${friend.friendCode}\``,
                color: 3596923, // energy-green
                image: {
                  url: `attachment://${fileName}`,
                },
              });

              const qrPngBuffer = await QRCode.toBuffer(friend.payload, {
                errorCorrectionLevel: 'H',
                margin: 2,
                width: 360,
              });

              const fileBlob = new Blob([qrPngBuffer], { type: 'image/png' });
              formData.append(`files[${i}]`, fileBlob, fileName);
            }
          }

          formData.append('payload_json', JSON.stringify(payloadJson));

          const discordRes = await fetch(userData.discordWebhook, {
            method: 'POST',
            body: formData,
          });

          if (!discordRes.ok) {
            throw new Error(`Discord post failed status ${discordRes.status}`);
          }
          discordSent = true;
        } catch (discordErr) {
          console.error(`Failed to send Discord webhook for user ${uid}:`, discordErr);
        }
      }

      // 2. Web Push Notification Channel
      if (settings.push && userData.fcmTokens && userData.fcmTokens.length > 0) {
        try {
          await messaging.sendEachForMulticast({
            tokens: userData.fcmTokens,
            notification: {
              title: 'Dragon Radar Scan Complete ☄️',
              body: 'Today\'s Shenron QR codes are ready to view on your dashboard!',
            },
            data: {
              url: '/',
            },
          });
          pushSent = true;
        } catch (pushErr) {
          console.error(`Failed to send FCM web push for user ${uid}:`, pushErr);
        }
      }

      // Write idempotency log
      await logRef.set({
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'success',
        channels: {
          discord: discordSent,
          push: pushSent,
        },
      });
    } catch (userErr) {
      console.error(`Error processing reminders for user ${uid}:`, userErr);
      await logRef.set({
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'failed',
        error: userErr instanceof Error ? userErr.message : 'Unknown error',
      });
    }
  }
}
