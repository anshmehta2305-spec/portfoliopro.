export function maskPAN(pan: string): string {
  if (!pan || pan.length < 10) return pan || "";
  return `••••••${pan.slice(6)}`;
}

export function maskAadhaar(aadhaar: string): string {
  const clean = aadhaar.replace(/\s/g, "");
  if (!clean || clean.length < 12) return aadhaar || "";
  return `••••••••${clean.slice(-4)}`;
}

export function maskBankAccount(account: string): string {
  if (!account || account.length < 4) return account || "";
  return `••••••••${account.slice(-4)}`;
}

