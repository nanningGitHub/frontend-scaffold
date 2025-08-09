import { test, expect } from '@playwright/test';

test.describe('Login flow (UI + API via MSW)', () => {
  test('navigates to login and shows form', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '登录' }).click();
    await expect(page).toHaveURL(/login/);
    await expect(page.getByLabel('邮箱地址')).toBeVisible();
    await expect(page.getByLabel('密码')).toBeVisible();
  });

  test('successful login redirects to profile', async ({ page }) => {
    await page.goto('/login');
    await page.waitForFunction(() => (window as any).__mswReady !== undefined);
    await page.getByLabel('邮箱地址').fill('user@example.com');
    await page.getByLabel('密码').fill('password123');
    await page.locator('form').getByRole('button', { name: '登录' }).click();
    // 登录后跳转到首页，随后可进入受保护页面
    await page.goto('/profile');
    await expect(page.getByText('个人资料')).toBeVisible({ timeout: 15000 });
  });
});
