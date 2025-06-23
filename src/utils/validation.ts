export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string | boolean): boolean {
  return typeof password === 'string' && password.length >= 8;
}

/**
 * Normalize account_id to a valid integer or undefined.
 * Returns undefined if input is not a valid positive integer.
 */
export function normalizeAccountId(input: any): number | undefined {
  if (input === undefined || input === null || input === '') return undefined;
  const num = Number(input);
  if (Number.isInteger(num) && num > 0) return num;
  return undefined;
}
