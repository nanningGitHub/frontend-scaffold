import { http, HttpResponse } from 'msw'

function extractBearerToken(request: Request): string | null {
  const auth = request.headers.get('authorization') || request.headers.get('Authorization')
  if (!auth) return null
  const parts = auth.split(' ')
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1]
  }
  return null
}

export const handlers = [
  // 登录：仅当账号密码正确时返回 token
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    const { email, password } = body
    if (email === 'user@example.com' && password === 'password123') {
      return HttpResponse.json({ token: 'mock-token', user: { id: 1, name: 'Mock User', email } })
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }),

  // 获取当前用户：根据 Bearer token 决定结果
  http.get('/api/auth/me', ({ request }) => {
    const token = extractBearerToken(request)
    if (token === 'mock-token') {
      return HttpResponse.json({ id: 1, name: 'Mock User', email: 'user@example.com' })
    }
    if (token === 'forbidden') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    if (token === 'expired') {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }),

  // 刷新令牌：当旧 token 过期时返回新 token
  http.post('/api/auth/refresh', ({ request }) => {
    const token = extractBearerToken(request)
    if (!token || token === 'expired') {
      return HttpResponse.json({ token: 'mock-token' })
    }
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }),
]


