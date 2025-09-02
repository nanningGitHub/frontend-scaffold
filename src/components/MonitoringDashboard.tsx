import React, { useState, useEffect } from 'react';
import { monitoring } from '../utils/enterpriseMonitoring';

interface MonitoringData {
  metrics: Array<{
    name: string;
    value: number;
    timestamp: number;
    url: string;
    userAgent: string;
  }>;
  errors: Array<{
    message: string;
    stack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    timestamp: number;
    url: string;
    userAgent: string;
  }>;
  events: Array<{
    type: string;
    target: string;
    timestamp: number;
    url: string;
    userId?: string;
    sessionId: string;
  }>;
}

/**
 * 企业级监控面板组件
 *
 * 功能：
 * 1. 实时性能指标监控
 * 2. 错误追踪和统计
 * 3. 用户行为分析
 * 4. 系统健康状态
 */
const MonitoringDashboard: React.FC = () => {
  const [data, setData] = useState<MonitoringData>({
    metrics: [],
    errors: [],
    events: [],
  });
  const [isVisible, setIsVisible] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  useEffect(() => {
    const updateData = () => {
      const monitoringData = monitoring.getMonitoringData();
      setData(monitoringData);
    };

    updateData();
    const interval = setInterval(updateData, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatValue = (value: number, unit: string = 'ms') => {
    return `${value.toFixed(2)}${unit}`;
  };

  const getPerformanceScore = (metric: string, value: number) => {
    const thresholds = {
      page_load_time: { good: 2000, poor: 4000 },
      dom_content_loaded: { good: 1000, poor: 2000 },
      first_paint: { good: 1000, poor: 2000 },
      click_response_time: { good: 100, poor: 300 },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'average';
    return 'poor';
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'average':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Open Monitoring Dashboard"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <h3 className="font-semibold">Monitoring Dashboard</h3>
        <div className="flex space-x-2">
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="text-xs bg-gray-700 text-white rounded px-2 py-1"
          >
            <option value={1000}>1s</option>
            <option value={5000}>5s</option>
            <option value={10000}>10s</option>
          </select>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {/* Performance Metrics */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">
            Performance Metrics
          </h4>
          <div className="space-y-2">
            {data.metrics.slice(-5).map((metric, index) => {
              const score = getPerformanceScore(metric.name, metric.value);
              return (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600 capitalize">
                    {metric.name.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">
                      {formatValue(metric.value)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getScoreColor(
                        score
                      )}`}
                    >
                      {score}
                    </span>
                  </div>
                </div>
              );
            })}
            {data.metrics.length === 0 && (
              <p className="text-gray-500 text-sm">
                No performance data available
              </p>
            )}
          </div>
        </div>

        {/* Errors */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Recent Errors</h4>
          <div className="space-y-2">
            {data.errors.slice(-3).map((error, index) => (
              <div
                key={index}
                className="bg-red-50 border border-red-200 rounded p-2"
              >
                <div className="text-sm text-red-800 font-medium">
                  {error.message}
                </div>
                <div className="text-xs text-red-600 mt-1">
                  {formatTimestamp(error.timestamp)}
                </div>
                {error.filename && (
                  <div className="text-xs text-red-500 mt-1">
                    {error.filename}:{error.lineno}:{error.colno}
                  </div>
                )}
              </div>
            ))}
            {data.errors.length === 0 && (
              <p className="text-gray-500 text-sm">No errors detected</p>
            )}
          </div>
        </div>

        {/* User Events */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Recent Events</h4>
          <div className="space-y-1">
            {data.events.slice(-5).map((event, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-600">
                  {event.type} on {event.target}
                </span>
                <span className="text-gray-500 text-xs">
                  {formatTimestamp(event.timestamp)}
                </span>
              </div>
            ))}
            {data.events.length === 0 && (
              <p className="text-gray-500 text-sm">No events recorded</p>
            )}
          </div>
        </div>

        {/* System Status */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">System Status</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Metrics:</span>
              <span className="font-mono">{data.metrics.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Errors:</span>
              <span className="font-mono text-red-600">
                {data.errors.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Events:</span>
              <span className="font-mono">{data.events.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  data.errors.length === 0
                    ? 'text-green-600 bg-green-100'
                    : 'text-red-600 bg-red-100'
                }`}
              >
                {data.errors.length === 0 ? 'Healthy' : 'Issues'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
