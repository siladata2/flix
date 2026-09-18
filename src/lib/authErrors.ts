// Supabase returns terse, English, developer-facing error strings.
// This maps the common ones to friendlier copy shown in the UI.
export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();

  if (m.includes('invalid login credentials')) {
    return 'That username/email or password is incorrect. Double-check both and try again.';
  }
  if (m.includes('email not confirmed')) {
    return 'This email address hasn\u2019t been verified yet. Check your inbox (and spam folder) for the confirmation link, or resend it below.';
  }
  if (m.includes('user already registered')) {
    return 'An account with this email already exists — try signing in instead.';
  }
  if (m.includes('password should be at least')) {
    return message; // already specific and actionable
  }
  if (m.includes('rate limit')) {
    return 'Too many attempts — please wait a minute and try again.';
  }
  if (m.includes('network')) {
    return 'Could not reach the server. Check your connection and try again.';
  }
  return message;
}

export function isUnconfirmedEmailError(message: string): boolean {
  return message.toLowerCase().includes('email not confirmed');
}
