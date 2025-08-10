import { performanceMonitor } from './performance';

/**
 * 企业级监控系统
 * 集成多种监控指标和告警机制
 */
export class EnterpriseMonitoring {
  private static instance: EnterpriseMonitoring;
  private metrics: Map<string, MetricData> = new Map();
  private alerts: Alert[] = [];
  private observers: Set<MonitoringObserver> = new Set();

  static getInstance(): EnterpriseMonitoring {
    if (!EnterpriseMonitoring.instance) {
      EnterpriseMonitoring.instance = new EnterpriseMonitoring();
    }
    return EnterpriseMonitoring.instance;
  }

  /**
   * 记录性能指标
   */
  recordMetric(
    name: string,
    value: number,
    tags?: Record<string, string>
  ): void {
    const metric: MetricData = {
      name,
      value,
      tags: tags || {},
      timestamp: Date.now(),
      type: 'performance',
    };

    this.metrics.set(`${name}_${Date.now()}`, metric);

    // 检查告警阈值
    this.checkAlertThresholds(metric);

    // 通知观察者
    this.notifyObservers('metric', metric);

    // 发送到外部监控系统
    this.sendToExternalSystem(metric);
  }

  /**
   * 记录业务指标
   */
  recordBusinessMetric(
    name: string,
    value: number,
    context?: Record<string, any>
  ): void {
    const metric: MetricData = {
      name,
      value,
      tags: { type: 'business', ...context },
      timestamp: Date.now(),
      type: 'business',
    };

    this.metrics.set(`${name}_${Date.now()}`, metric);
    this.notifyObservers('business', metric);
  }

  /**
   * 记录错误
   */
  recordError(error: Error, context?: Record<string, any>): void {
    const errorMetric: MetricData = {
      name: 'error',
      value: 1,
      tags: {
        type: 'error',
        message: error.message,
        stack: error.stack,
        ...context,
      },
      timestamp: Date.now(),
      type: 'error',
    };

    this.metrics.set(`error_${Date.now()}`, errorMetric);

    // 错误告警
    this.createAlert(
      'error',
      `Error occurred: ${error.message}`,
      'high',
      context
    );

    // 发送到错误追踪系统
    this.sendToErrorTracking(error, context);
  }

  /**
   * 记录用户行为
   */
  recordUserAction(
    action: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    const actionMetric: MetricData = {
      name: 'user_action',
      value: 1,
      tags: {
        type: 'user_action',
        action,
        userId: userId || 'anonymous',
        ...metadata,
      },
      timestamp: Date.now(),
      type: 'user_action',
    };

    this.metrics.set(`user_action_${Date.now()}`, actionMetric);
  }

  /**
   * 检查告警阈值
   */
  private checkAlertThresholds(metric: MetricData): void {
    const thresholds = this.getAlertThresholds(metric.name);

    if (thresholds) {
      if (metric.value > thresholds.warning) {
        this.createAlert(
          'warning',
          `${metric.name} exceeded warning threshold`,
          'medium',
          {
            metric: metric.name,
            value: metric.value,
            threshold: thresholds.warning,
          }
        );
      }

      if (metric.value > thresholds.critical) {
        this.createAlert(
          'critical',
          `${metric.name} exceeded critical threshold`,
          'high',
          {
            metric: metric.name,
            value: metric.value,
            threshold: thresholds.critical,
          }
        );
      }
    }
  }

  /**
   * 创建告警
   */
  private createAlert(
    type: string,
    message: string,
    severity: 'low' | 'medium' | 'high',
    context?: Record<string, any>
  ): void {
    const alert: Alert = {
      id: `alert_${Date.now()}`,
      type,
      message,
      severity,
      context,
      timestamp: Date.now(),
      status: 'active',
    };

    this.alerts.push(alert);

    // 发送告警通知
    this.sendAlertNotification(alert);

    // 通知观察者
    this.notifyObservers('alert', alert);
  }

  /**
   * 获取告警阈值配置
   */
  private getAlertThresholds(metricName: string): AlertThresholds | null {
    const thresholds: Record<string, AlertThresholds> = {
      page_load_time: { warning: 3000, critical: 5000 },
      api_response_time: { warning: 1000, critical: 3000 },
      memory_usage: { warning: 80, critical: 95 },
      error_rate: { warning: 5, critical: 10 },
    };

    return thresholds[metricName] || null;
  }

  /**
   * 发送告警通知
   */
  private sendAlertNotification(alert: Alert): void {
    // 集成外部通知系统 (Slack, 邮件, 短信等)
    if (alert.severity === 'high') {
      this.sendHighPriorityAlert(alert);
    }
  }

  /**
   * 发送高优先级告警
   */
  private sendHighPriorityAlert(alert: Alert): void {
    // 这里可以集成具体的通知渠道
    console.error('🚨 HIGH PRIORITY ALERT:', alert);

    // 示例：发送到 Slack
    // this.sendToSlack(alert);

    // 示例：发送邮件
    // this.sendEmail(alert);
  }

  /**
   * 发送到外部监控系统
   */
  private sendToExternalSystem(metric: MetricData): void {
    // 集成 Prometheus, DataDog, New Relic 等
    if (window.gtag) {
      window.gtag('event', 'metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        ...metric.tags,
      });
    }
  }

  /**
   * 发送到错误追踪系统
   */
  private sendToErrorTracking(
    error: Error,
    context?: Record<string, any>
  ): void {
    // 集成 Sentry 等错误追踪系统
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          monitoring: context,
        },
      });
    }
  }

  /**
   * 添加监控观察者
   */
  addObserver(observer: MonitoringObserver): void {
    this.observers.add(observer);
  }

  /**
   * 移除监控观察者
   */
  removeObserver(observer: MonitoringObserver): void {
    this.observers.delete(observer);
  }

  /**
   * 通知观察者
   */
  private notifyObservers(type: string, data: any): void {
    this.observers.forEach((observer) => {
      try {
        observer(type, data);
      } catch (error) {
        console.error('Monitoring observer error:', error);
      }
    });
  }

  /**
   * 获取监控报告
   */
  getMonitoringReport(): MonitoringReport {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    const recentMetrics = Array.from(this.metrics.values()).filter(
      (metric) => metric.timestamp > oneHourAgo
    );

    const activeAlerts = this.alerts.filter(
      (alert) => alert.status === 'active'
    );

    return {
      metrics: recentMetrics,
      alerts: activeAlerts,
      summary: this.generateSummary(recentMetrics, activeAlerts),
    };
  }

  /**
   * 生成监控摘要
   */
  private generateSummary(
    metrics: MetricData[],
    alerts: Alert[]
  ): MonitoringSummary {
    const errorCount = metrics.filter((m) => m.type === 'error').length;
    const avgResponseTime =
      metrics
        .filter((m) => m.name === 'api_response_time')
        .reduce((sum, m) => sum + m.value, 0) / metrics.length || 0;

    return {
      totalMetrics: metrics.length,
      errorCount,
      activeAlerts: alerts.length,
      avgResponseTime,
      timestamp: Date.now(),
    };
  }

  /**
   * 清理旧数据
   */
  cleanup(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    // 清理旧指标
    for (const [key, metric] of this.metrics.entries()) {
      if (metric.timestamp < oneDayAgo) {
        this.metrics.delete(key);
      }
    }

    // 清理已处理的告警
    this.alerts = this.alerts.filter(
      (alert) => alert.status === 'active' || alert.timestamp > oneDayAgo
    );
  }
}

// 类型定义
interface MetricData {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: number;
  type: 'performance' | 'business' | 'error' | 'user_action';
}

interface Alert {
  id: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  context?: Record<string, any>;
  timestamp: number;
  status: 'active' | 'resolved';
}

interface AlertThresholds {
  warning: number;
  critical: number;
}

interface MonitoringObserver {
  (type: string, data: any): void;
}

interface MonitoringReport {
  metrics: MetricData[];
  alerts: Alert[];
  summary: MonitoringSummary;
}

interface MonitoringSummary {
  totalMetrics: number;
  errorCount: number;
  activeAlerts: number;
  avgResponseTime: number;
  timestamp: number;
}

// 导出单例
export const monitoring = EnterpriseMonitoring.getInstance();

// 全局类型声明
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    Sentry?: {
      captureException: (error: Error, context?: any) => void;
    };
  }
}
