import crypto from "crypto";

// Simple password hashing with salt (use bcrypt in production)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const attempt = crypto.scryptSync(password, salt, 64).toString("hex");
  return hash === attempt;
}

// Simple session token (use JWT in production)
export function generateToken(userId: number): string {
  const payload = { userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }; // 7 days
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function parseToken(token: string): { userId: number } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// Extract user from Authorization header
export function getUserFromRequest(request: Request): { userId: number } | null {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return parseToken(auth.slice(7));
}
