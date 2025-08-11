import React, { useEffect, useRef } from 'react';

interface VueMicroAppContainerProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Vue微应用容器组件
 * 用于加载运行在端口3004的Vue微服务
 */
const VueMicroAppContainer: React.FC<VueMicroAppContainerProps> = ({
  className = '',
  style = {},
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // 监听来自Vue微应用的消息
    const handleMessage = (event: MessageEvent) => {
      // 验证消息来源
      if (event.origin !== 'http://localhost:3004') {
        return;
      }

      // 处理不同类型的消息
      switch (event.data.type) {
        case 'THEME_CHANGE':
          // 处理主题切换
          // 可以在这里添加主题切换逻辑
          break;
        case 'LOCALE_CHANGE':
          // 处理语言切换
          // 可以在这里添加语言切换逻辑
          break;
        case 'NAVIGATION':
          // 处理导航请求
          // 可以在这里添加导航逻辑
          break;
        default:
          // 处理其他消息类型
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // 向Vue微应用发送消息
  const sendMessageToVue = (type: string, payload: Record<string, unknown>) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type, payload, source: 'react-host' },
        'http://localhost:3004'
      );
    }
  };

  return (
    <div className={`vue-micro-app-container ${className}`} style={style}>
      <div className="vue-app-header mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Vue微应用
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          这是一个运行在端口3004的Vue微前端应用
        </p>

        {/* 控制按钮 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => sendMessageToVue('THEME_CHANGE', { theme: 'dark' })}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
          >
            发送深色主题
          </button>
          <button
            onClick={() => sendMessageToVue('THEME_CHANGE', { theme: 'light' })}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
          >
            发送浅色主题
          </button>
          <button
            onClick={() => sendMessageToVue('LOCALE_CHANGE', { locale: 'en' })}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            发送英文语言
          </button>
          <button
            onClick={() => sendMessageToVue('LOCALE_CHANGE', { locale: 'zh' })}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            发送中文语言
          </button>
        </div>
      </div>

      {/* Vue微应用iframe容器 */}
      <div className="vue-app-content">
        <iframe
          ref={iframeRef}
          src="http://localhost:3004"
          className="w-full h-96 border border-gray-300 rounded-lg"
          title="Vue微应用"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>

      <div className="vue-app-info mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-400">
        <p>• Vue微应用运行在端口3004</p>
        <p>• 使用iframe方式集成</p>
        <p>• 支持跨应用消息通信</p>
        <p>• 可以发送主题和语言切换指令</p>
      </div>
    </div>
  );
};

export default VueMicroAppContainer;
