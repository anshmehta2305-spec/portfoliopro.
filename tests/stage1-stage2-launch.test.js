const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

// --- 1. Test Trading Config & Feature Flags Logic ---
test('Trading Config - Stage 1 Default State Verification', () => {
  const isLiveTradingEnabled = process.env.NEXT_PUBLIC_LIVE_TRADING_ENABLED === 'true';
  const amfiArn = process.env.NEXT_PUBLIC_AMFI_ARN || '';

  // In showcase mode, live trading must evaluate to false
  assert.strictEqual(isLiveTradingEnabled, false);

  // If ARN is empty, fallback display must be present
  const arnDisplay = amfiArn.trim() !== '' ? amfiArn : 'ARN Pending Activation';
  assert.strictEqual(arnDisplay, 'ARN Pending Activation');
});

// --- 2. Test AES-256-GCM Field-Level PII Encryption & Decryption ---
test('Security - AES-256-GCM Field-Level PII Encryption & Decryption', () => {
  const ALGORITHM = 'aes-256-gcm';
  const IV_LENGTH = 16;
  const secretKey = crypto.createHash('sha256').update('portfolio-pro-dev-test-secret').digest();

  function encryptPii(plaintext) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, secretKey, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  function decryptPii(ciphertext) {
    const [ivHex, tagHex, encryptedHex] = ciphertext.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, secretKey, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  const sensitivePan = 'ABCDE1234F';
  const sensitiveAadhaar = '987654321098';
  const sensitiveBank = '0012987654321';

  const encryptedPan = encryptPii(sensitivePan);
  const encryptedAadhaar = encryptPii(sensitiveAadhaar);
  const encryptedBank = encryptPii(sensitiveBank);

  // Ciphertext must not match plaintext
  assert.notStrictEqual(encryptedPan, sensitivePan);
  assert.ok(encryptedPan.includes(':'), 'Encrypted string must have format iv:tag:ciphertext');

  // Decryption must return exact original plaintext
  assert.strictEqual(decryptPii(encryptedPan), sensitivePan);
  assert.strictEqual(decryptPii(encryptedAadhaar), sensitiveAadhaar);
  assert.strictEqual(decryptPii(encryptedBank), sensitiveBank);
});

// --- 3. Test Order Idempotency & Replay Protection ---
test('Financial Integrity - Order Idempotency Engine', () => {
  const processedKeys = new Map();

  function generateOrderFingerprint(params) {
    const raw = `${params.clientPan.toUpperCase()}|${params.fundId}|${params.orderType}|${params.amount || 0}|${params.units || 0}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  function checkIdempotency(key) {
    const existing = processedKeys.get(key);
    if (existing) return { isDuplicate: true, cachedResult: existing.result };
    return { isDuplicate: false };
  }

  function recordIdempotency(key, result) {
    processedKeys.set(key, { timestamp: Date.now(), result });
  }

  const orderData = {
    clientPan: 'ABCDE1234F',
    fundId: 'fund_hdfc_top100',
    orderType: 'PURCHASE',
    amount: 25000,
  };

  const key = generateOrderFingerprint(orderData);
  assert.strictEqual(typeof key, 'string');
  assert.strictEqual(key.length, 64, 'SHA-256 hash must be 64 characters');

  // First check: should not be duplicate
  const check1 = checkIdempotency(key);
  assert.strictEqual(check1.isDuplicate, false);

  // Record order execution
  recordIdempotency(key, { orderId: 'BSE_12345', status: 'ACCEPTED' });

  // Second check: must be recognized as duplicate
  const check2 = checkIdempotency(key);
  assert.strictEqual(check2.isDuplicate, true);
  assert.strictEqual(check2.cachedResult.orderId, 'BSE_12345');
});

// --- 4. Test Payment Webhook Timing-Safe Signature Verification ---
test('Security - Webhook Signature Verification Timing-Safe HMAC', () => {
  const secret = 'test_webhook_secret_key_12345';
  const payload = JSON.stringify({ event: 'payment.captured', payment_id: 'pay_test_001', amount: 599900 });

  function verifyWebhookSignature(rawBody, receivedSignature, webhookSecret) {
    if (!webhookSecret || !receivedSignature) return false;
    try {
      const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const receivedBuffer = Buffer.from(receivedSignature, 'utf8');
      if (expectedBuffer.length !== receivedBuffer.length) return false;
      return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
    } catch {
      return false;
    }
  }

  const validSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const invalidSignature = 'bad_forged_signature_0000000000000000000000000000000000000000000000';

  assert.strictEqual(verifyWebhookSignature(payload, validSignature, secret), true);
  assert.strictEqual(verifyWebhookSignature(payload, invalidSignature, secret), false);
  assert.strictEqual(verifyWebhookSignature(payload, '', secret), false);
});

// --- 5. Test KYC Adapter PAN Verification Logic ---
test('Compliance - KYC Adapter PAN Verification', () => {
  function verifyPanKyc(pan) {
    const cleanPan = (pan || '').trim().toUpperCase();
    const isCompliant = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan);
    return {
      pan: cleanPan,
      isKycCompliant: isCompliant,
      kycStatus: isCompliant ? 'VERIFIED' : 'PENDING',
      kraName: 'CVL_KRA',
    };
  }

  const validPanCheck = verifyPanKyc('ABCDE1234F');
  assert.strictEqual(validPanCheck.isKycCompliant, true);
  assert.strictEqual(validPanCheck.kycStatus, 'VERIFIED');
  assert.strictEqual(validPanCheck.kraName, 'CVL_KRA');

  const invalidPanCheck = verifyPanKyc('INVALIDPAN');
  assert.strictEqual(invalidPanCheck.isKycCompliant, false);
  assert.strictEqual(invalidPanCheck.kycStatus, 'PENDING');
});
