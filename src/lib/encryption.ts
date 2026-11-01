/**
 * Portfolio Pro - Field-Level PII Encryption (AES-256-GCM)
 * Encrypts sensitive financial data (PAN, Bank Account, Aadhaar) at rest.
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

// Derive 32-byte key from ENCRYPTION_KEY or fallback to SHA-256 hash of NEXTAUTH_SECRET
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || "default-dev-encryption-key-32-bytes!!";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a plaintext string into a hex string containing IV + Tag + Ciphertext
 */
export function encryptPii(plaintext: string): string {
  if (!plaintext) return "";
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encrypted
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption failed:", error);
    return plaintext;
  }
}

/**
 * Decrypts a formatted hex string back to plaintext
 */
export function decryptPii(ciphertext: string): string {
  if (!ciphertext || !ciphertext.includes(":")) return ciphertext;
  try {
    const parts = ciphertext.split(":");
    if (parts.length !== 3) return ciphertext;

    const [ivHex, tagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(tagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.warn("Decryption failed or data was unencrypted plaintext:", (error as Error).message);
    return ciphertext;
  }
}

