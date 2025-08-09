import { test, expect } from '@playwright/test'

test.describe('Login flow (UI only)', () => {
  test('navigates to login and shows form', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: '登录' }).click()
    await expect(page).toHaveURL(/login/)
    await expect(page.getByLabel('邮箱地址')).toBeVisible()
    await expect(page.getByLabel('密码')).toBeVisible()
  })
})


