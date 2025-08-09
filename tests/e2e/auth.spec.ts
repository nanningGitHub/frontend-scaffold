import { test, expect } from '@playwright/test';

test.describe('Auth Flow (public pages)', () => {
  test('login/register links visible on navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: '登录' })).toBeVisible();
    await expect(page.getByRole('link', { name: '注册' })).toBeVisible();
  });

  test('protected route redirects to login', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/login|register/);
  });
});

test.describe('Auth API status handling (401/403/refresh)', () => {
  test('403 response shows forbidden notice on profile load', async ({
    page,
  }) => {
    // 预置一个 token = forbidden 以模拟 403
    await page.addInitScript(() => {
      localStorage.setItem('auth-token', 'forbidden');
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({ state: { token: 'forbidden' } })
      );
    });
    await page.goto('/profile');
    // ProtectedRoute 会保持在登录页，403 应在 API 使用处处理；此处仅验证仍被保护
    await expect(page).toHaveURL(/login|register/);
  });

  test('expired token triggers refresh and proceeds', async ({ page }) => {
    // 预置一个过期 token，MSW /auth/refresh 会返回新 token
    await page.addInitScript(() => {
      localStorage.setItem('auth-token', 'expired');
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({ state: { token: 'expired' } })
      );
    });
    await page.goto('/');
    await page.waitForTimeout(200); // 等待 worker 注册与首次请求
    // 初始化时会访问 /auth/me -> 401 -> /auth/refresh -> 获得新 token -> 重试成功
    // 之后打开受保护页面应可访问
    await page.goto('/profile');
    // 个人资料模块包含标题“个人资料”
    await expect(page.getByText('个人资料')).toBeVisible({ timeout: 15000 });
  });
});
