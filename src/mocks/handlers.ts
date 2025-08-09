import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json()
    const { email } = body as { email: string }
    if (email === 'user@example.com') {
      return HttpResponse.json({ token: 'mock-token', user: { id: 1, name: 'Mock User', email } })
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }),
  http.get('/api/auth/me', () => {
    return HttpResponse.json({ id: 1, name: 'Mock User', email: 'user@example.com' })
  }),
]


