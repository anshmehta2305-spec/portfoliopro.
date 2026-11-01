const test = require('node:test');
const assert = require('node:assert/strict');
const { z } = require('zod');

// Regulatory Financial Regex Patterns
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const AADHAAR_REGEX = /^[2-9]\d{11}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

const clientRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(INDIAN_MOBILE_REGEX, "Invalid Indian mobile number (must be 10 digits starting with 6-9)"),
  pan: z.string().regex(PAN_REGEX, "Invalid PAN format (Must be 5 uppercase letters, 4 numbers, 1 letter)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const bankKycSchema = z.object({
  aadhaar: z.string().regex(AADHAAR_REGEX, "Invalid 12-digit Aadhaar number"),
  ifsc: z.string().regex(IFSC_REGEX, "Invalid 11-character Indian IFSC code"),
  accountNumber: z.string().min(9).max(18),
});

const callbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(INDIAN_MOBILE_REGEX, "Please enter a valid 10-digit Indian mobile number"),
  arn: z.string().optional(),
  city: z.string().optional(),
});

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().regex(INDIAN_MOBILE_REGEX),
  arn: z.string().optional(),
  city: z.string().min(2),
  interestedIn: z.array(z.string()).min(1, "Select at least one service"),
  captchaAnswer: z.number(),
  captchaExpected: z.number(),
}).refine(data => data.captchaAnswer === data.captchaExpected, {
  message: "Math captcha answer is incorrect",
  path: ["captchaAnswer"]
});

test('Validates Indian 10-digit mobile number starting with 6-9', () => {
  assert.equal(callbackSchema.safeParse({ name: 'Vikram', phone: '9820112345' }).success, true);
  assert.equal(callbackSchema.safeParse({ name: 'Vikram', phone: '8820112345' }).success, true);
  assert.equal(callbackSchema.safeParse({ name: 'Vikram', phone: '7820112345' }).success, true);
  assert.equal(callbackSchema.safeParse({ name: 'Vikram', phone: '6820112345' }).success, true);

  // Invalid phones
  assert.equal(callbackSchema.safeParse({ name: 'Vikram', phone: '5820112345' }).success, false); // Starts with 5
  assert.equal(callbackSchema.safeParse({ name: 'Vikram', phone: '1234567890' }).success, false); // Starts with 1
  assert.equal(callbackSchema.safeParse({ name: 'Vikram', phone: '982011234' }).success, false);   // 9 digits
  assert.equal(callbackSchema.safeParse({ name: 'Vikram', phone: '98201123456' }).success, false); // 11 digits
});

test('Validates Permanent Account Number (PAN) according to Income Tax format', () => {
  // Valid PANs: 5 uppercase letters, 4 digits, 1 uppercase letter
  assert.equal(PAN_REGEX.test('ABCDE1234F'), true);
  assert.equal(PAN_REGEX.test('BPKPS5678G'), true);
  assert.equal(PAN_REGEX.test('CRJPG9012H'), true);

  // Invalid PANs
  assert.equal(PAN_REGEX.test('abcde1234f'), false); // Lowercase
  assert.equal(PAN_REGEX.test('12345ABCDE'), false); // Inverted format
  assert.equal(PAN_REGEX.test('ABC123456F'), false); // Wrong letter count
  assert.equal(PAN_REGEX.test('ABCDE12345'), false); // Missing trailing letter
  assert.equal(PAN_REGEX.test('ABCDE1234FF'), false); // Too long
});

test('Validates Aadhaar 12-digit number (cannot start with 0 or 1)', () => {
  assert.equal(AADHAAR_REGEX.test('987654321098'), true);
  assert.equal(AADHAAR_REGEX.test('234567890123'), true);

  // Invalid Aadhaar
  assert.equal(AADHAAR_REGEX.test('012345678901'), false); // Starts with 0
  assert.equal(AADHAAR_REGEX.test('123456789012'), false); // Starts with 1
  assert.equal(AADHAAR_REGEX.test('98765432109'), false);  // 11 digits
  assert.equal(AADHAAR_REGEX.test('9876543210989'), false); // 13 digits
});

test('Validates RBI IFSC Code format (4 letters, 5th character 0, 6 alphanumeric)', () => {
  assert.equal(IFSC_REGEX.test('HDFC0000123'), true);
  assert.equal(IFSC_REGEX.test('SBIN0001234'), true);
  assert.equal(IFSC_REGEX.test('ICIC0000001'), true);

  // Invalid IFSC
  assert.equal(IFSC_REGEX.test('HDFC1000123'), false); // 5th char is not 0
  assert.equal(IFSC_REGEX.test('HDF00001234'), false);  // 3 letters instead of 4
  assert.equal(IFSC_REGEX.test('HDFCA000123'), false); // 5th char is letter
  assert.equal(IFSC_REGEX.test('HDFC000012'), false);   // Only 10 chars
});

test('Validates full Client Registration payload with min lengths and email validation', () => {
  const validUser = clientRegistrationSchema.safeParse({
    name: 'Rajesh Sharma',
    email: 'rajesh@example.com',
    phone: '9820112345',
    pan: 'ABCDE1234F',
    password: 'SecurePassword123',
  });
  assert.equal(validUser.success, true);

  // Short password (< 8 chars)
  const shortPass = clientRegistrationSchema.safeParse({
    name: 'Rajesh Sharma',
    email: 'rajesh@example.com',
    phone: '9820112345',
    pan: 'ABCDE1234F',
    password: 'short',
  });
  assert.equal(shortPass.success, false);

  // Invalid email
  const badEmail = clientRegistrationSchema.safeParse({
    name: 'Rajesh Sharma',
    email: 'not-an-email',
    phone: '9820112345',
    pan: 'ABCDE1234F',
    password: 'SecurePassword123',
  });
  assert.equal(badEmail.success, false);
});

test('Validates Math Captcha in Contact Form', () => {
  const valid = contactSchema.safeParse({
    name: 'Ananya',
    email: 'ananya@example.com',
    mobile: '9876543210',
    city: 'Kolkata',
    interestedIn: ['Investor App', 'BSE StarMF'],
    captchaAnswer: 15,
    captchaExpected: 15,
  });
  assert.equal(valid.success, true);

  const invalid = contactSchema.safeParse({
    name: 'Ananya',
    email: 'ananya@example.com',
    mobile: '9876543210',
    city: 'Kolkata',
    interestedIn: ['Investor App'],
    captchaAnswer: 12,
    captchaExpected: 15,
  });
  assert.equal(invalid.success, false);
});
