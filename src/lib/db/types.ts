export interface NotificationSettings {
  discord: boolean;
  push: boolean;
  sendAtHour: number;
  timezone: string;
}

export interface UserDoc {
  email: string;
  displayName: string;
  discordId?: string;
  discordWebhook?: string;
  fcmTokens: string[];
  notificationSettings: NotificationSettings;
  createdAt: number;
}

export interface AccountDoc {
  name: string;
  order: number;
  createdAt: number;
}

export interface FriendDoc {
  name: string;
  friendCode: string;
  createdAt: number;
}
