import React from 'react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

/**
 * 语言切换组件属性接口
 */
interface LanguageSwitcherProps {
  className?: string
  showLabel?: boolean
  variant?: 'dropdown' | 'buttons'
}

/**
 * 语言切换组件
 * 
 * 功能：
 * 1. 支持中英文切换
 * 2. 自动保存语言偏好
 * 3. 响应式设计
 * 4. 多种显示模式
 */
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  showLabel = true,
  variant = 'dropdown'
}) => {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  // 支持的语言
  const languages = [
    { code: 'zh', name: t('languages.zh'), flag: '🇨🇳' },
    { code: 'en', name: t('languages.en'), flag: '🇺🇸' }
  ]

  // 当前语言
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  // 切换语言
  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
  }

  // 下拉菜单模式
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          {showLabel && (
            <span className="hidden sm:inline">{currentLanguage.name}</span>
          )}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    i18n.language === language.code
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                  {i18n.language === language.code && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // 按钮模式
  return (
    <div className={`flex space-x-2 ${className}`}>
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => changeLanguage(language.code)}
          className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            i18n.language === language.code
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="text-lg">{language.flag}</span>
          {showLabel && <span>{language.name}</span>}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
