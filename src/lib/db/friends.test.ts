import { describe, it, expect, vi, beforeEach } from 'vitest';

const addDoc = vi.fn().mockResolvedValue({ id: 'f1' });
const collection = vi.fn().mockReturnValue({ __type: 'collection' });
const serverTimestamp = vi.fn().mockReturnValue('TS');

vi.mock('firebase/firestore', () => ({
  addDoc: (...a: unknown[]) => addDoc(...a),
  collection: (...a: unknown[]) => collection(...a),
  serverTimestamp: () => serverTimestamp(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
}));
vi.mock('./../firebase/app', () => ({ getDb: () => ({ __type: 'db' }) }));

import { addFriend } from './friends';

beforeEach(() => {
  addDoc.mockClear();
  collection.mockClear();
});

describe('addFriend', () => {
  it('rejects an invalid friend code before touching firestore', async () => {
    await expect(addFriend('u1', 'a1', 'Goku', 'bad code')).rejects.toThrow(/friend code/i);
    expect(addDoc).not.toHaveBeenCalled();
  });

  it('writes a friend doc with the validated code and a server timestamp', async () => {
    const id = await addFriend('u1', 'a1', 'Goku', 'dr85d9jy');
    expect(id).toBe('f1');
    expect(collection).toHaveBeenCalledWith({ __type: 'db' }, 'users/u1/accounts/a1/friends');
    const written = addDoc.mock.calls[0][1] as Record<string, unknown>;
    expect(written.name).toBe('Goku');
    expect(written.friendCode).toBe('dr85d9jy');
    expect(written.createdAt).toBe('TS');
  });
});
