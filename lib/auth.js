import { SignJWT, jwtVerify } from 'jose'

const SECRET = () => new TextEncoder().encode(
  process.env.JWT_SECRET || 'change-this-in-production-please'
)

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET())
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET())
    return payload
  } catch {
    return null
  }
}

export function setAuthCookie(response, token) {
  response.cookies.set('pb_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7,
    path:     '/',
  })
  return response
}

export function clearAuthCookie(response) {
  response.cookies.set('pb_token', '', { maxAge: 0, path: '/' })
  return response
}
