/**
 * 简化的微前端管理器
 *
 * 功能：
 * 1. 基础微应用加载
 * 2. 路由管理
 * 3. 生命周期管理
 */

import { logger } from './simpleLogger';

export interface MicroApp {
  id: string;
  name: string;
  url: string;
  container: string;
  activeRule: string | RegExp;
}

export interface MicroAppState {
  id: string;
  status: 'loading' | 'loaded' | 'error' | 'unmounted';
  error?: string;
}

export class SimpleMicroFrontendManager {
  private apps: Map<string, MicroApp> = new Map();
  private appStates: Map<string, MicroAppState> = new Map();
  private currentApp: string | null = null;

  constructor() {
    this.initRouteListener();
  }

  /**
   * 注册微应用
   */
  registerApp(app: MicroApp): void {
    this.apps.set(app.id, app);
    this.appStates.set(app.id, {
      id: app.id,
      status: 'unmounted',
    });

    logger.info(`Micro app registered: ${app.name}`);
  }

  /**
   * 初始化路由监听
   */
  private initRouteListener(): void {
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });

    // 初始路由处理
    this.handleRouteChange();
  }

  /**
   * 处理路由变化
   */
  private handleRouteChange(): void {
    const path = window.location.pathname;
    const targetApp = this.findAppByPath(path);

    if (targetApp && targetApp !== this.currentApp) {
      this.loadApp(targetApp);
    }
  }

  /**
   * 根据路径查找应用
   */
  private findAppByPath(path: string): string | null {
    for (const [id, app] of this.apps) {
      if (this.matchRoute(path, app.activeRule)) {
        return id;
      }
    }
    return null;
  }

  /**
   * 匹配路由规则
   */
  private matchRoute(path: string, rule: string | RegExp): boolean {
    if (typeof rule === 'string') {
      return path.startsWith(rule);
    }
    return rule.test(path);
  }

  /**
   * 加载微应用
   */
  private async loadApp(appId: string): Promise<void> {
    const app = this.apps.get(appId);
    if (!app) {
      logger.error(`App not found: ${appId}`);
      return;
    }

    // 卸载当前应用
    if (this.currentApp) {
      await this.unloadApp(this.currentApp);
    }

    // 更新状态
    this.appStates.set(appId, { id: appId, status: 'loading' });
    this.currentApp = appId;

    try {
      // 加载微应用脚本
      await this.loadScript(app.url);

      // 挂载应用
      await this.mountApp(app);

      this.appStates.set(appId, { id: appId, status: 'loaded' });
      logger.info(`Micro app loaded: ${app.name}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.appStates.set(appId, {
        id: appId,
        status: 'error',
        error: errorMessage,
      });
      logger.error(`Failed to load micro app: ${app.name}`, error);
    }
  }

  /**
   * 加载脚本
   */
  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.head.appendChild(script);
    });
  }

  /**
   * 挂载应用
   */
  private async mountApp(app: MicroApp): Promise<void> {
    const container = document.getElementById(app.container);
    if (!container) {
      throw new Error(`Container not found: ${app.container}`);
    }

    // 这里应该调用微应用的挂载方法
    // 实际实现需要根据具体的微前端框架来调整
    logger.info(`Mounting app: ${app.name} to container: ${app.container}`);
  }

  /**
   * 卸载应用
   */
  private async unloadApp(appId: string): Promise<void> {
    const app = this.apps.get(appId);
    if (!app) return;

    // 这里应该调用微应用的卸载方法
    logger.info(`Unloading app: ${app.name}`);

    this.appStates.set(appId, { id: appId, status: 'unmounted' });
  }

  /**
   * 获取应用状态
   */
  getAppState(appId: string): MicroAppState | undefined {
    return this.appStates.get(appId);
  }

  /**
   * 获取所有应用状态
   */
  getAllAppStates(): MicroAppState[] {
    return Array.from(this.appStates.values());
  }
}

// 导出单例实例
export const microFrontendManager = new SimpleMicroFrontendManager();
