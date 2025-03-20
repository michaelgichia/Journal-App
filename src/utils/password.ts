import { Sha256 } from '@aws-crypto/sha256-browser';

// Generate a random salt (hex string, Edge-compatible)
function generateSalt(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

// Convert string to ArrayBuffer for hashing
function stringToArrayBuffer(str: string) {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

// Convert ArrayBuffer to hex string
function arrayBufferToHex(buffer: Uint8Array<ArrayBufferLike>): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

// Hash the password with SHA-256, iterating for security
async function hashWithSha256(data: string, salt: string, iterations: number = 100000): Promise<string> {
  let current = data + salt;

  for (let i = 0; i < iterations; i++) {
    const sha256 = new Sha256(); // Create a new instance for each iteration
    // @ts-expect-error - todo
    sha256.update(stringToArrayBuffer(current));
    const hash = await sha256.digest();
    current = arrayBufferToHex(hash);
  }

  return current;
}

export async function saltAndHashPassword(password: string): Promise<string> {
  const salt = generateSalt(16);
  const hashed = await hashWithSha256(password, salt, 100000);
  return `${salt}:${hashed}`;
}

export async function comparePasswords(password: string, storedHash: string): Promise<boolean> {
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) {
    throw new Error('Invalid hash format');
  }

  const hashedPassword = await hashWithSha256(password, salt, 100000);

  return hashedPassword === originalHash;

}