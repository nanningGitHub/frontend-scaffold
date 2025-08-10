/** @type {import('tailwindcss').Config} */
export default {
  // 指定需要扫描的文件，用于生成 CSS
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  // 启用深色模式
  darkMode: 'class',

  // 主题配置
  theme: {
    // 扩展默认主题
    extend: {
      // 自定义颜色
      colors: {
        // 主色调配置
        primary: {
          50: '#eff6ff', // 最浅色
          100: '#dbeafe', // 浅色
          200: '#bfdbfe', // 较浅色
          300: '#93c5fd', // 中等浅色
          400: '#60a5fa', // 中等色
          500: '#3b82f6', // 主色
          600: '#2563eb', // 中等深色
          700: '#1d4ed8', // 较深色
          800: '#1e40af', // 深色
          900: '#1e3a8a', // 最深色
        },
      },

      // 自定义字体
      fontFamily: {
        // 无衬线字体配置
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },

  // 插件配置
  plugins: [],
};
