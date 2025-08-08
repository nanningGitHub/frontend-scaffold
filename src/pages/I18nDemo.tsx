import { useTranslation } from 'react-i18next'
import { useI18n } from '../hooks/useI18n'
import LanguageSwitcher from '../components/LanguageSwitcher'

/**
 * 国际化演示页面
 * 
 * 功能：
 * 1. 展示国际化功能
 * 2. 演示语言切换
 * 3. 展示格式化工具
 * 4. 提供使用示例
 */
const I18nDemo = () => {
  const { t } = useTranslation()
  const { currentLanguage, formatDate, formatNumber, formatCurrency, isRTL } = useI18n()

  return (
    <div className="max-w-4xl mx-auto">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('i18n.demo.title', '国际化功能演示')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('i18n.demo.subtitle', '展示多语言支持和本地化功能')}
        </p>
      </div>

      {/* 语言切换器演示 */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('i18n.demo.languageSwitcher', '语言切换器')}
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              {t('i18n.demo.currentLanguage', '当前语言')}: <strong>{currentLanguage}</strong>
            </p>
            <p className="text-sm text-gray-600">
              {t('i18n.demo.direction', '文字方向')}: <strong>{isRTL() ? 'RTL' : 'LTR'}</strong>
            </p>
          </div>
          <div className="flex gap-2">
            <LanguageSwitcher variant="dropdown" showLabel={true} />
            <LanguageSwitcher variant="buttons" showLabel={false} />
          </div>
        </div>
      </div>

      {/* 翻译示例 */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('i18n.demo.translations', '翻译示例')}
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">{t('common.loading')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('common.success')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('common.error')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('navigation.home')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('navigation.about')}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('i18n.demo.formatting', '格式化示例')}
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">
                {t('i18n.demo.date', '日期')}: {formatDate(new Date())}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {t('i18n.demo.number', '数字')}: {formatNumber(1234567.89)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {t('i18n.demo.currency', '货币')}: {formatCurrency(1234.56)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {t('i18n.demo.percentage', '百分比')}: {formatNumber(0.1234, { style: 'percent' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 插值示例 */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('i18n.demo.interpolation', '插值示例')}
        </h3>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            {t('i18n.demo.welcome', '欢迎，{{name}}！', { name: '张三' })}
          </p>
          <p className="text-sm text-gray-600">
            {t('i18n.demo.items', '您有 {{count}} 个项目', { count: 5 })}
          </p>
          <p className="text-sm text-gray-600">
            {t('i18n.demo.price', '价格：{{currency}}{{amount}}', { 
              currency: '¥', 
              amount: formatNumber(99.99) 
            })}
          </p>
        </div>
      </div>

      {/* 复数示例 */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('i18n.demo.plural', '复数示例')}
        </h3>
        <div className="space-y-2">
          {[0, 1, 2, 5].map(count => (
            <p key={count} className="text-sm text-gray-600">
              {t('i18n.demo.item', '{{count}} 个项目', { count })}
            </p>
          ))}
        </div>
      </div>

      {/* 使用说明 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('i18n.demo.usage', '使用说明')}
        </h3>
        <div className="prose prose-sm max-w-none">
          <h4 className="text-md font-medium text-gray-900 mb-2">
            {t('i18n.demo.basicUsage', '基本使用')}
          </h4>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.description')}</p>
    </div>
  )
}`}
          </pre>

          <h4 className="text-md font-medium text-gray-900 mb-2 mt-4">
            {t('i18n.demo.advancedUsage', '高级使用')}
          </h4>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { useI18n } from '@/hooks/useI18n'

function MyComponent() {
  const { t, currentLanguage, formatDate, formatCurrency } = useI18n()
  
  return (
    <div>
      <p>当前语言: {currentLanguage}</p>
      <p>日期: {formatDate(new Date())}</p>
      <p>货币: {formatCurrency(1234.56)}</p>
    </div>
  )
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default I18nDemo
