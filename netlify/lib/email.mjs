// Checks an email address. Returns it in lower case, or null if it is not valid.
// A first character among = + - @ is refused: a spreadsheet would read it as a formula.
export function validEmail(value) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@=+\-][^\s@]{0,63}@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null;
  return email;
}
