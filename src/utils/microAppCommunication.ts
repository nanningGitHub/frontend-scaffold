import { MicroAppMessage, MicroAppEvent } from '../types/microfrontend';

/**
 * 微前端应用间通信管理器
 * 负责处理微前端应用之间的消息传递和事件通信
 */
export class MicroAppCommunication {
  private static instance: MicroAppCommunication;
  private messageHandlers: Map<
    string,
    Set<(message: MicroAppMessage) => void>
  > = new Map();
  private eventHandlers: Map<string, Set<(event: MicroAppEvent) => void>> =
    new Map();
  private messageQueue: MicroAppMessage[] = [];
  private isProcessing = false;

  static getInstance(): MicroAppCommunication {
    if (!MicroAppCommunication.instance) {
      MicroAppCommunication.instance = new MicroAppCommunication();
    }
    return MicroAppCommunication.instance;
  }

  /**
   * 发送消息到指定的微前端应用
   */
  sendMessage(
    targetApp: string,
    message: Omit<MicroAppMessage, 'timestamp' | 'id'>
  ): void {
    const fullMessage: MicroAppMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: Date.now(),
    };

    // 添加到消息队列
    this.messageQueue.push(fullMessage);

    // 如果目标应用已注册，直接发送
    if (this.messageHandlers.has(targetApp)) {
      this.deliverMessage(targetApp, fullMessage);
    }

    // 处理消息队列
    if (!this.isProcessing) {
      this.processMessageQueue();
    }
  }

  /**
   * 广播消息到所有微前端应用
   */
  broadcastMessage(message: Omit<MicroAppMessage, 'timestamp' | 'id'>): void {
    const fullMessage: MicroAppMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: Date.now(),
    };

    // 添加到消息队列
    this.messageQueue.push(fullMessage);

    // 广播到所有已注册的应用
    this.messageHandlers.forEach((_, appName) => {
      this.deliverMessage(appName, fullMessage);
    });

    // 处理消息队列
    if (!this.isProcessing) {
      this.processMessageQueue();
    }
  }

  /**
   * 注册消息处理器
   */
  onMessage(
    appName: string,
    handler: (message: MicroAppMessage) => void
  ): () => void {
    if (!this.messageHandlers.has(appName)) {
      this.messageHandlers.set(appName, new Set());
    }

    const handlers = this.messageHandlers.get(appName)!;
    handlers.add(handler);

    // 返回取消注册函数
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.messageHandlers.delete(appName);
      }
    };
  }

  /**
   * 发送事件到指定的微前端应用
   */
  sendEvent(
    targetApp: string,
    event: Omit<MicroAppEvent, 'timestamp' | 'id'>
  ): void {
    const fullEvent: MicroAppEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now(),
    };

    // 如果目标应用已注册，直接发送
    if (this.eventHandlers.has(targetApp)) {
      this.deliverEvent(targetApp, fullEvent);
    }
  }

  /**
   * 广播事件到所有微前端应用
   */
  broadcastEvent(event: Omit<MicroAppEvent, 'timestamp' | 'id'>): void {
    const fullEvent: MicroAppEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now(),
    };

    // 广播到所有已注册的应用
    this.eventHandlers.forEach((_, appName) => {
      this.deliverEvent(appName, fullEvent);
    });
  }

  /**
   * 注册事件处理器
   */
  onEvent(
    appName: string,
    handler: (event: MicroAppEvent) => void
  ): () => void {
    if (!this.eventHandlers.has(appName)) {
      this.eventHandlers.set(appName, new Set());
    }

    const handlers = this.eventHandlers.get(appName)!;
    handlers.add(handler);

    // 返回取消注册函数
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(appName);
      }
    };
  }

  /**
   * 获取应用状态
   */
  getAppStatus(appName: string): {
    hasMessageHandlers: boolean;
    hasEventHandlers: boolean;
  } {
    return {
      hasMessageHandlers: this.messageHandlers.has(appName),
      hasEventHandlers: this.eventHandlers.has(appName),
    };
  }

  /**
   * 清理应用注册
   */
  cleanupApp(appName: string): void {
    this.messageHandlers.delete(appName);
    this.eventHandlers.delete(appName);
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    messageHandlers: number;
    eventHandlers: number;
    messageQueueLength: number;
  } {
    let totalMessageHandlers = 0;
    let totalEventHandlers = 0;

    this.messageHandlers.forEach((handlers) => {
      totalMessageHandlers += handlers.size;
    });

    this.eventHandlers.forEach((handlers) => {
      totalEventHandlers += handlers.size;
    });

    return {
      messageHandlers: totalMessageHandlers,
      eventHandlers: totalEventHandlers,
      messageQueueLength: this.messageQueue.length,
    };
  }

  private deliverMessage(appName: string, message: MicroAppMessage): void {
    const handlers = this.messageHandlers.get(appName);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(message);
        } catch (error) {
          console.error(`Error delivering message to ${appName}:`, error);
        }
      });
    }
  }

  private deliverEvent(appName: string, event: MicroAppEvent): void {
    const handlers = this.eventHandlers.get(appName);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error delivering event to ${appName}:`, error);
        }
      });
    }
  }

  private async processMessageQueue(): Promise<void> {
    if (this.isProcessing || this.messageQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        if (message) {
          // 处理延迟消息
          await this.processDelayedMessage(message);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async processDelayedMessage(message: MicroAppMessage): Promise<void> {
    // 检查消息是否过期（超过5秒）
    const now = Date.now();
    if (now - message.timestamp > 5000) {
      console.warn('Message expired:', message);
      return;
    }

    // 尝试重新投递消息
    if (message.target && this.messageHandlers.has(message.target)) {
      this.deliverMessage(message.target, message);
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default MicroAppCommunication;

// 导出全局通信实例
export const globalCommunication = MicroAppCommunication.getInstance();
