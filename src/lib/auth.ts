import { cookies } from 'next/headers';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'stem123@admin';
const AUTH_COOKIE_NAME = 'stem_admin_session';
const SECRET_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'stem_secure_token_secret_2026';

export async function verifyAdminCredentials(user: string, pass: string): Promise<boolean> {
  return user === ADMIN_USERNAME && pass === ADMIN_PASSWORD;
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, SECRET_TOKEN, {
    httpOnly: true,
    secure: false, // Cho phép hoạt động ổn định trên cả môi trường HTTP local và HTTPS Cloudflare
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
    path: '/',
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    return token === SECRET_TOKEN;
  } catch {
    return false;
  }
}
