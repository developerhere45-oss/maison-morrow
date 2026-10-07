export type ContactPayload = { name?: unknown; email?: unknown; message?: unknown };

export function validateContact(payload: ContactPayload) {
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  if (!name || !email || !message) return 'Name, email, and message are required.';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please provide a valid email address.';
  if (name.length > 100 || email.length > 254 || message.length > 5000) return 'Your message is too long.';
  return null;
}
