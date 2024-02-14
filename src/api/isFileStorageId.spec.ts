import { isFileStorageId } from './isFileStorageId';

describe('isFileStorageId', () => {
  it('should return true for a valid UUID', () => {
    const validUUID = '1a2b3c4d-5e6f-4a3b-9f8b-c1d2e3f4a5b3';
    const result = isFileStorageId(validUUID);
    expect(result).toBeTruthy();
  });

  it('should return true for a valid UUID with object revision', () => {
    const validUUID = '1a2b3c4d-5e6f-4a3b-9f8b-c1d2e3f4a5b3/revs/123';
    const result = isFileStorageId(validUUID);
    expect(result).toBeTruthy();
  });

  it('should return false for an invalid UUID', () => {
    const invalidUUID = 'not-a-uuid';
    const result = isFileStorageId(invalidUUID);
    expect(result).toBeFalsy();
  });
});
