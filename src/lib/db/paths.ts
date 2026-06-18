export const userPath = (uid: string) => `users/${uid}`;
export const accountsPath = (uid: string) => `${userPath(uid)}/accounts`;
export const accountPath = (uid: string, accountId: string) => `${accountsPath(uid)}/${accountId}`;
export const friendsPath = (uid: string, accountId: string) => `${accountPath(uid, accountId)}/friends`;
export const friendPath = (uid: string, accountId: string, friendId: string) =>
  `${friendsPath(uid, accountId)}/${friendId}`;
