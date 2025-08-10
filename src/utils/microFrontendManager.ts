import {
  MicroApp,
  MicroAppState,
  MicroAppLifecycle,
  MicroFrontendConfig,
} from '../types/microfrontend';

/**
 * 微前端管理器
 * 负责微应用的加载、卸载和生命周期管理
 */
export class MicroFrontendManager {
  private apps: Map<string, MicroApp> = new Map();
  private appStates: Map<string, MicroAppState> = new Map();
  private lifecycle?: MicroAppLifecycle;
  private sandbox: boolean;
  private singular: boolean;
  private sandboxContexts: Map<string, Record<string, unknown>> = new Map();

  constructor(config: MicroFrontendConfig) {
    this.sandbox = config.sandbox ?? true;
    this.singular = config.singular ?? true;
    this.lifecycle = config.lifecycle;

    // 注册微应用
    config.apps.forEach((app) => this.registerApp(app));

    // 监听路由变化
    this.initRouteListener();
  }

  /**
   * 注册微应用
   */
  private registerApp(app: MicroApp): void {
    this.apps.set(app.id, app);
    this.appStates.set(app.id, {
      id: app.id,
      status: 'unmounted',
    });
  }

  /**
   * 初始化路由监听器
   */
  private initRouteListener(): void {
    // 监听 popstate 事件
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });

    // 监听 pushstate 和 replacestate 事件
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handleRouteChange();
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handleRouteChange();
    };

    // 初始路由检查
    this.handleRouteChange();
  }

  /**
   * 处理路由变化
   */
  private handleRouteChange(): void {
    const currentPath = window.location.pathname;

    // 找到当前应该激活的微应用
    const activeApp = Array.from(this.apps.values()).find((app) => {
      if (typeof app.activeRule === 'function') {
        return app.activeRule(window.location);
      }
      return currentPath.startsWith(app.activeRule);
    });

    if (activeApp) {
      this.loadApp(activeApp.id);
    } else {
      // 卸载所有微应用
      this.unloadAllApps();
    }
  }

  /**
   * 加载微应用
   */
  async loadApp(appId: string): Promise<void> {
    const app = this.apps.get(appId);
    if (!app) {
      throw new Error(`Micro app ${appId} not found`);
    }

    const appState = this.appStates.get(appId)!;

    try {
      // 如果应用已经加载，先卸载
      if (appState.status === 'mounted') {
        await this.unloadApp(appId);
      }

      // 执行 beforeLoad 生命周期
      if (this.lifecycle?.beforeLoad) {
        await this.lifecycle.beforeLoad(app);
      }

      // 更新状态为加载中
      appState.status = 'loading';

      // 如果启用了单一实例模式，先卸载其他应用
      if (this.singular) {
        await this.unloadOtherApps(appId);
      }

      // 执行 beforeMount 生命周期
      if (this.lifecycle?.beforeMount) {
        await this.lifecycle.beforeMount(app);
      }

      // 加载微应用
      await this.loadRemoteApp(app);

      // 更新状态为已挂载
      appState.status = 'mounted';

      // 执行 afterMount 生命周期
      if (this.lifecycle?.afterMount) {
        await this.lifecycle.afterMount(app);
      }
    } catch (error) {
      appState.status = 'error';
      appState.error = error as Error;

      if (this.lifecycle?.onError) {
        this.lifecycle.onError(error as Error, app);
      }

      throw error;
    }
  }

  /**
   * 加载远程微应用
   */
  private async loadRemoteApp(app: MicroApp): Promise<void> {
    try {
      // 动态导入远程模块
      const remoteModule = await import(/* webpackIgnore: true */ app.entry);

      // 获取微应用组件
      const MicroAppComponent =
        remoteModule.default || remoteModule[app.module];

      if (!MicroAppComponent) {
        throw new Error(`Failed to load micro app component from ${app.entry}`);
      }

      // 创建容器
      const container = this.createContainer(app.container);
      const appState = this.appStates.get(app.id)!;
      appState.container = container;

      // 创建沙箱环境
      if (this.sandbox) {
        this.createSandbox(app.id, container);
      }

      // 渲染微应用
      if (typeof MicroAppComponent === 'function') {
        // React 组件 - 使用 React 18 的 createRoot API
        await this.renderReactComponent(
          MicroAppComponent,
          app.props,
          container
        );
      } else {
        // 其他类型的组件
        container.appendChild(MicroAppComponent);
      }
    } catch (error) {
      throw new Error(`Failed to load remote app: ${error}`);
    }
  }

  /**
   * 使用 React 18 createRoot API 渲染组件
   */
  private async renderReactComponent(
    Component: any,
    props: Record<string, unknown>,
    container: HTMLElement
  ): Promise<void> {
    try {
      const React = await import('react');
      const ReactDOM = await import('react-dom/client');

      // 使用 React 18 的 createRoot API
      const root = ReactDOM.createRoot(container);

      // 将 root 实例存储在容器上，以便后续清理
      (container as Record<string, unknown>).__reactRoot = root;

      root.render(React.createElement(Component, props));
    } catch (error) {
      console.error('Failed to render React component:', error);
      throw error;
    }
  }

  /**
   * 创建沙箱环境
   */
  private createSandbox(appId: string, container: HTMLElement): void {
    try {
      // 创建 iframe 沙箱
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';

      // 设置沙箱属性
      iframe.setAttribute(
        'sandbox',
        'allow-scripts allow-same-origin allow-forms allow-popups'
      );

      // 将 iframe 添加到容器
      container.appendChild(iframe);

      // 存储沙箱上下文
      this.sandboxContexts.set(appId, { iframe, container });
    } catch (error) {
      console.warn(
        'Failed to create sandbox, falling back to container isolation:',
        error
      );
    }
  }

  /**
   * 创建容器
   */
  private createContainer(containerId: string): HTMLElement {
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement('div');
      container.id = containerId; // 修复：正确设置 ID
      container.className = 'micro-app-container';
      container.setAttribute('data-micro-app', containerId);
      document.body.appendChild(container);
    }

    return container;
  }

  /**
   * 卸载微应用
   */
  async unloadApp(appId: string): Promise<void> {
    const app = this.apps.get(appId);
    const appState = this.appStates.get(appId);

    if (!app || !appState || appState.status === 'unmounted') {
      return;
    }

    try {
      // 执行 beforeUnmount 生命周期
      if (this.lifecycle?.beforeUnmount) {
        await this.lifecycle.beforeUnmount(app);
      }

      // 清理 React 根节点
      if (appState.container && (appState.container as Record<string, unknown>).__reactRoot) {
        try {
          (appState.container as Record<string, unknown>).__reactRoot.unmount();
        } catch (error) {
          console.warn('Failed to unmount React root:', error);
        }
      }

      // 清理沙箱环境
      if (this.sandbox) {
        this.cleanupSandbox(appId);
      }

      // 清理容器
      if (appState.container) {
        appState.container.innerHTML = '';
        appState.container.remove();
        appState.container = undefined;
      }

      // 更新状态
      appState.status = 'unmounted';

      // 执行 afterUnmount 生命周期
      if (this.lifecycle?.afterUnmount) {
        await this.lifecycle.afterUnmount(app);
      }
    } catch (error) {
      console.error(`Error unloading app ${appId}:`, error);
    }
  }

  /**
   * 清理沙箱环境
   */
  private cleanupSandbox(appId: string): void {
    const sandboxContext = this.sandboxContexts.get(appId);
    if (sandboxContext) {
      try {
        if (sandboxContext.iframe) {
          sandboxContext.iframe.remove();
        }
        this.sandboxContexts.delete(appId);
      } catch (error) {
        console.warn('Failed to cleanup sandbox:', error);
      }
    }
  }

  /**
   * 卸载其他微应用
   */
  private async unloadOtherApps(excludeAppId: string): Promise<void> {
    const promises = Array.from(this.appStates.keys())
      .filter((id) => id !== excludeAppId)
      .map((id) => this.unloadApp(id));

    await Promise.all(promises);
  }

  /**
   * 卸载所有微应用
   */
  async unloadAllApps(): Promise<void> {
    const promises = Array.from(this.appStates.keys()).map((id) =>
      this.unloadApp(id)
    );
    await Promise.all(promises);
  }

  /**
   * 获取微应用状态
   */
  getAppState(appId: string): MicroAppState | undefined {
    return this.appStates.get(appId);
  }

  /**
   * 获取所有微应用状态
   */
  getAllAppStates(): MicroAppState[] {
    return Array.from(this.appStates.values());
  }

  /**
   * 检查微应用是否已加载
   */
  isAppLoaded(appId: string): boolean {
    const state = this.appStates.get(appId);
    return state?.status === 'mounted';
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    this.unloadAllApps();
    this.apps.clear();
    this.appStates.clear();
    this.sandboxContexts.clear();
  }
}
