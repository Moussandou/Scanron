import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDoc = vi.fn().mockImplementation((...args: any[]) => {
  const id = typeof args[args.length - 1] === 'string' ? args[args.length - 1] : 'mock-doc-id';
  return { id };
});
const mockGetDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockSetDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockCollection = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (...args: any[]) => mockCollection(...args),
  doc: (...args: any[]) => mockDoc(...args),
  getDoc: (...args: any[]) => mockGetDoc(...args),
  getDocs: (...args: any[]) => mockGetDocs(...args),
  setDoc: (...args: any[]) => mockSetDoc(...args),
  updateDoc: (...args: any[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: any[]) => mockDeleteDoc(...args),
  arrayUnion: (val: any) => ({ __type: 'arrayUnion', val }),
  arrayRemove: (val: any) => ({ __type: 'arrayRemove', val }),
  deleteField: () => ({ __type: 'deleteField' }),
}));

vi.mock('../firebase/app', () => ({
  getDb: () => ({ __type: 'db' }),
}));

import { createFamily, joinFamily, leaveFamily, addFamilyFriend, removeFamilyFriend } from './families';

beforeEach(() => {
  mockDoc.mockClear();
  mockGetDoc.mockReset();
  mockGetDocs.mockReset();
  mockSetDoc.mockClear();
  mockUpdateDoc.mockClear();
  mockDeleteDoc.mockClear();
  mockCollection.mockClear();
});

describe('families database operations', () => {
  it('creates a family and links it to the owner user', async () => {
    mockDoc.mockReturnValueOnce({ id: 'fam123' });

    const familyId = await createFamily('Moussandou Family', 'u1');

    expect(familyId).toBe('fam123');
    expect(mockSetDoc).toHaveBeenCalled();
    const familyData = mockSetDoc.mock.calls[0][1];
    expect(familyData.name).toBe('Moussandou Family');
    expect(familyData.ownerUid).toBe('u1');
    expect(familyData.memberUids).toEqual(['u1']);

    expect(mockUpdateDoc).toHaveBeenCalled();
    const userUpdate = mockUpdateDoc.mock.calls[0][1];
    expect(userUpdate.familyId).toBe('fam123');
  });

  it('joins a family and links it to the member user', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ name: 'Moussandou Family', ownerUid: 'u1', memberUids: ['u1'] }),
    });

    await joinFamily('fam123', 'u2');

    expect(mockUpdateDoc).toHaveBeenCalledTimes(2);
    // First updates the family document
    const familyUpdate = mockUpdateDoc.mock.calls[0][1];
    expect(familyUpdate.memberUids.val).toBe('u2');
    // Second updates the user document
    const userUpdate = mockUpdateDoc.mock.calls[1][1];
    expect(userUpdate.familyId).toBe('fam123');
  });

  it('allows a member to leave the family', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ name: 'Moussandou Family', ownerUid: 'u1', memberUids: ['u1', 'u2'] }),
    });

    await leaveFamily('fam123', 'u2');

    // Family doc memberUids updated
    expect(mockUpdateDoc).toHaveBeenCalled();
    const familyUpdate = mockUpdateDoc.mock.calls[0][1];
    expect(familyUpdate.memberUids.val).toBe('u2');

    // User doc familyId field deleted
    const userUpdate = mockUpdateDoc.mock.calls[1][1];
    expect(userUpdate.familyId.__type).toBe('deleteField');
  });

  it('disbands the family and cleans up data if the owner leaves', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ name: 'Moussandou Family', ownerUid: 'u1', memberUids: ['u1', 'u2'] }),
    });

    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { id: 'friend1', data: () => ({ name: 'Krillin', friendCode: 'kr123456' }) },
      ],
    });

    await leaveFamily('fam123', 'u1');

    // Updates member uids' documents to remove familyId
    expect(mockUpdateDoc).toHaveBeenCalled();
    const u1Update = mockUpdateDoc.mock.calls[0][1];
    expect(u1Update.familyId.__type).toBe('deleteField');
    const u2Update = mockUpdateDoc.mock.calls[1][1];
    expect(u2Update.familyId.__type).toBe('deleteField');

    // Friends subcollection deleted
    expect(mockDeleteDoc).toHaveBeenCalled();

    // Family document deleted
    expect(mockDeleteDoc).toHaveBeenCalledWith({ id: 'fam123' });
  });
});
