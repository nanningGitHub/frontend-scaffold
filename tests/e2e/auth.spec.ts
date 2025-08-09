import { test, expect } from '@playwright/test'

test.describe('Auth Flow (public pages)', () => {
  test('login/register links visible on navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: '登录' })).toBeVisible()
    await expect(page.getByRole('link', { name: '注册' })).toBeVisible()
  })

  test('protected route redirects to login', async ({ page }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL(/login|register/)
  })
})


