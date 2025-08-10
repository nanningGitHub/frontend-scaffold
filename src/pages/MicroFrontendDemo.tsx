import React, { useState, useEffect } from 'react';
import { MicroAppContainer } from '../components/MicroAppContainer';
import { globalCommunication } from '../utils/microAppCommunication';
import {
  microApps,
  communicationConfig,
  styleConfig,
} from '../config/microFrontend';
import { MicroAppState } from '../types/microfrontend';

/**
 * 微前端演示页面
 * 展示微应用的加载、管理和通信功能
 */
export const MicroFrontendDemo: React.FC = () => {
  const [activeApp, setActiveApp] = useState<string>('');
  const [appStates, setAppStates] = useState<Map<string, MicroAppState>>(
    new Map()
  );
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // 初始化应用状态
    const initialStates = new Map();
    microApps.forEach((app) => {
      initialStates.set(app.id, {
        id: app.id,
        status: 'unmounted',
      });
    });
    setAppStates(initialStates);

    // 订阅全局通信事件
    const unsubscribe = globalCommunication.onMessage(
      '*',
      (message) => {
        setMessages((prev) => [
          ...prev,
          { payload: message.payload, source: message.source, timestamp: message.timestamp },
        ]);
      }
    );

    return () => unsubscribe();
  }, []);

  // 加载微应用
  const loadApp = (appId: string) => {
    setActiveApp(appId);

    // 更新应用状态
    setAppStates((prev) => {
      const newStates = new Map(prev);
      newStates.set(appId, { ...newStates.get(appId)!, status: 'loading' });
      return newStates;
    });
  };

  // 卸载微应用
  const unloadApp = (appId: string) => {
    setActiveApp('');

    // 更新应用状态
    setAppStates((prev) => {
      const newStates = new Map(prev);
      newStates.set(appId, { ...newStates.get(appId)!, status: 'unmounted' });
      return newStates;
    });
  };

  // 发送消息到微应用
  const _sendMessage = (appId: string, eventType: string, payload: any) => {
    globalCommunication.sendMessage(appId, { type: eventType, payload, source: 'host' });
  };

  // 广播消息
  const broadcastMessage = (eventType: string, payload: any) => {
    globalCommunication.broadcastMessage({ type: eventType, payload, source: 'host' });
  };

  // 清空消息
  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="micro-frontend-demo">
      <div className="demo-header">
        <h1>微前端架构演示</h1>
        <p>展示微应用的加载、管理和通信功能</p>
      </div>

      <div className="demo-controls">
        <div className="app-selector">
          <h3>微应用管理</h3>
          <div className="app-buttons">
            {microApps.map((app) => (
              <button
                key={app.id}
                onClick={() =>
                  activeApp === app.id ? unloadApp(app.id) : loadApp(app.id)
                }
                className={`app-button ${activeApp === app.id ? 'active' : ''}`}
              >
                {activeApp === app.id ? '卸载' : '加载'} {app.name}
              </button>
            ))}
          </div>
        </div>

        <div className="communication-controls">
          <h3>通信控制</h3>
          <div className="message-controls">
            <button
              onClick={() =>
                broadcastMessage(communicationConfig.events.THEME_CHANGE, {
                  theme: 'dark',
                })
              }
              className="control-button"
            >
              切换主题
            </button>
            <button
              onClick={() =>
                broadcastMessage(communicationConfig.events.LOCALE_CHANGE, {
                  locale: 'en-US',
                })
              }
              className="control-button"
            >
              切换语言
            </button>
            <button
              onClick={() =>
                broadcastMessage(communicationConfig.events.DATA_UPDATE, {
                  timestamp: Date.now(),
                })
              }
              className="control-button"
            >
              数据更新
            </button>
          </div>
        </div>
      </div>

      <div className="demo-content">
        <div className="app-container">
          {activeApp && (
            <MicroAppContainer
              appId={activeApp}
              containerId={`${activeApp}-container`}
              entry={microApps.find((app) => app.id === activeApp)?.entry || ''}
              module="default"
              props={microApps.find((app) => app.id === activeApp)?.props || {}}
              onLoad={() => {
                setAppStates((prev) => {
                  const newStates = new Map(prev);
                  newStates.set(activeApp, {
                    ...newStates.get(activeApp)!,
                    status: 'mounted',
                  });
                  return newStates;
                });
              }}
              onError={(error) => {
                setAppStates((prev) => {
                  const newStates = new Map(prev);
                  newStates.set(activeApp, {
                    ...newStates.get(activeApp)!,
                    status: 'error',
                    error,
                  });
                  return newStates;
                });
              }}
              onUnload={() => {
                setAppStates((prev) => {
                  const newStates = new Map(prev);
                  newStates.set(activeApp, {
                    ...newStates.get(activeApp)!,
                    status: 'unmounted',
                  });
                  return newStates;
                });
              }}
              className="micro-app-container"
              style={styleConfig.container}
            />
          )}
        </div>

        <div className="app-status">
          <h3>应用状态</h3>
          <div className="status-list">
            {Array.from(appStates.entries()).map(([appId, state]) => (
              <div key={appId} className={`status-item ${state.status}`}>
                <span className="app-name">
                  {microApps.find((app) => app.id === appId)?.name}
                </span>
                <span className="status-badge">{state.status}</span>
                {state.error && (
                  <span className="error-message">{state.error.message}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="message-log">
          <div className="log-header">
            <h3>通信日志</h3>
            <button onClick={clearMessages} className="clear-button">
              清空
            </button>
          </div>
          <div className="log-content">
            {messages.length === 0 ? (
              <p className="no-messages">暂无通信消息</p>
            ) : (
              messages
                .slice(-10)
                .reverse()
                .map((message, index) => (
                  <div key={index} className="log-item">
                    <span className="timestamp">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="source">[{message.source}]</span>
                    <span className="payload">
                      {JSON.stringify(message.payload)}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroFrontendDemo;
