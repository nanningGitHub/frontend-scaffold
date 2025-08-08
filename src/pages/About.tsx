import { useTranslation } from 'react-i18next'

/**
 * 关于页面组件
 * 
 * 功能：
 * 1. 展示项目详细信息
 * 2. 列出技术栈和开发工具
 * 3. 提供可用的脚本命令
 * 
 * 特性：
 * - 响应式布局
 * - 技术栈展示
 * - 命令参考
 * - 国际化支持
 */
const About = () => {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto">
      {/* 页面标题区域 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('about.title')}</h1>
        <p className="text-xl text-gray-600">
          {t('about.subtitle')}
        </p>
      </div>

      {/* 技术栈和开发工具展示 */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* 技术栈列表 */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.techStack.title')}</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
              {t('about.techStack.react')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
              {t('about.techStack.typescript')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
              {t('about.techStack.vite')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
              {t('about.techStack.tailwind')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
              {t('about.techStack.router')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
              {t('about.techStack.testing')}
            </li>
          </ul>
        </div>

        {/* 开发工具列表 */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.devTools.title')}</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              {t('about.devTools.eslint')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              {t('about.devTools.prettier')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              {t('about.devTools.husky')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              {t('about.devTools.lintStaged')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              {t('about.devTools.postcss')}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              {t('about.devTools.autoprefixer')}
            </li>
          </ul>
        </div>
      </div>

      {/* 可用脚本命令展示 */}
      <div className="card mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.scripts.title')}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* 开发相关命令 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.scripts.development')}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code> - {t('about.scripts.dev')}</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">npm run build</code> - {t('about.scripts.build')}</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">npm run preview</code> - {t('about.scripts.preview')}</li>
            </ul>
          </div>
          
          {/* 代码质量相关命令 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.scripts.quality')}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><code className="bg-gray-100 px-2 py-1 rounded">npm run lint</code> - {t('about.scripts.lint')}</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">npm run lint:fix</code> - {t('about.scripts.lintFix')}</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">npm run format</code> - {t('about.scripts.format')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
