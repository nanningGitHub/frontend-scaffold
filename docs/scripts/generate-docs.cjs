#!/usr/bin/env node

/**
 * 组件文档生成脚本
 * 
 * 功能：
 * 1. 扫描组件目录
 * 2. 生成文档索引
 * 3. 检查文档完整性
 * 4. 更新统计信息
 */

const fs = require('fs')
const path = require('path')

// 配置
const CONFIG = {
  componentsDir: path.join(__dirname, '../../src/components'),
  docsDir: path.join(__dirname, '../components'),
  indexFile: path.join(__dirname, '../components/README.md'),
  mainIndexFile: path.join(__dirname, '../COMPONENTS.md'),
  excludeFiles: ['__tests__', 'index.ts', 'index.tsx'],
  excludeExtensions: ['.test.tsx', '.test.ts', '.spec.tsx', '.spec.ts']
}

// 组件分类
const COMPONENT_CATEGORIES = {
  'Layout.tsx': '布局组件',
  'Navigation.tsx': '布局组件',
  'ErrorBoundary.tsx': '功能组件',
  'LoadingSpinner.tsx': '功能组件',
  'NotificationSystem.tsx': '功能组件',
  'ProtectedRoute.tsx': '功能组件',
  'LoginForm.tsx': '表单组件',
  'RegisterForm.tsx': '表单组件',
  'UserProfile.tsx': '用户组件',
  'ApiExample.tsx': '用户组件'
}

/**
 * 扫描组件文件
 */
function scanComponents() {
  const components = []
  
  try {
    const files = fs.readdirSync(CONFIG.componentsDir)
    
    files.forEach(file => {
      if (CONFIG.excludeFiles.includes(file)) return
      if (CONFIG.excludeExtensions.some(ext => file.endsWith(ext))) return
      
      const filePath = path.join(CONFIG.componentsDir, file)
      const stats = fs.statSync(filePath)
      
      if (stats.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
        const componentName = file.replace(/\.(tsx|ts)$/, '')
        const category = COMPONENT_CATEGORIES[file] || '其他组件'
        
        components.push({
          name: componentName,
          file: file,
          category: category,
          hasDoc: fs.existsSync(path.join(CONFIG.docsDir, `${componentName}.md`))
        })
      }
    })
  } catch (error) {
    console.error('扫描组件目录失败:', error.message)
  }
  
  return components
}

/**
 * 生成统计信息
 */
function generateStats(components) {
  const stats = {
    total: components.length,
    documented: components.filter(c => c.hasDoc).length,
    categories: {}
  }
  
  components.forEach(component => {
    if (!stats.categories[component.category]) {
      stats.categories[component.category] = {
        count: 0,
        documented: 0
      }
    }
    
    stats.categories[component.category].count++
    if (component.hasDoc) {
      stats.categories[component.category].documented++
    }
  })
  
  return stats
}

/**
 * 生成文档索引内容
 */
function generateIndexContent(components, stats) {
  const categories = {}
  
  // 按分类组织组件
  components.forEach(component => {
    if (!categories[component.category]) {
      categories[component.category] = []
    }
    categories[component.category].push(component)
  })
  
  let content = `# 组件文档索引

本目录包含项目中所有组件的详细文档。

## 📋 组件分类

`

  // 生成分类列表
  Object.entries(categories).forEach(([category, categoryComponents]) => {
    const icon = getCategoryIcon(category)
    content += `### ${icon} ${category}\n`
    
    categoryComponents.forEach(component => {
      const status = component.hasDoc ? '✅' : '⏳'
      content += `- [${component.name}](./${component.name}.md) - ${getComponentDescription(component.name)} ${status}\n`
    })
    
    content += '\n'
  })
  
  // 添加统计信息
  content += `## 📊 组件统计

| 分类 | 组件数量 | 文档完成度 |
|------|----------|------------|
`
  
  Object.entries(stats.categories).forEach(([category, categoryStats]) => {
    const percentage = Math.round((categoryStats.documented / categoryStats.count) * 100)
    content += `| ${category} | ${categoryStats.count} | ${percentage}% |\n`
  })
  
  content += `| **总计** | **${stats.total}** | **${Math.round((stats.documented / stats.total) * 100)}%** |\n\n`
  
  content += `> ✅ 已完成 | ⏳ 待完成\n\n`
  
  return content
}

/**
 * 获取分类图标
 */
function getCategoryIcon(category) {
  const icons = {
    '布局组件': '🏗️',
    '功能组件': '🛠️',
    '表单组件': '📝',
    '用户组件': '👤',
    '其他组件': '📦'
  }
  return icons[category] || '📦'
}

/**
 * 获取组件描述
 */
function getComponentDescription(componentName) {
  const descriptions = {
    'Layout': '应用主布局组件',
    'Navigation': '导航栏组件',
    'ErrorBoundary': '错误边界组件',
    'LoadingSpinner': '加载状态组件',
    'NotificationSystem': '通知系统组件',
    'ProtectedRoute': '路由保护组件',
    'LoginForm': '登录表单组件',
    'RegisterForm': '注册表单组件',
    'UserProfile': '用户资料组件',
    'ApiExample': 'API 示例组件'
  }
  return descriptions[componentName] || `${componentName} 组件`
}

/**
 * 更新主文档索引
 */
function updateMainIndex(components, stats) {
  try {
    let content = fs.readFileSync(CONFIG.mainIndexFile, 'utf8')
    
    // 更新组件列表
    const categories = {}
    components.forEach(component => {
      if (!categories[component.category]) {
        categories[component.category] = []
      }
      categories[component.category].push(component)
    })
    
    let newComponentList = ''
    Object.entries(categories).forEach(([category, categoryComponents]) => {
      const icon = getCategoryIcon(category)
      newComponentList += `### ${icon} ${category}\n`
      
      categoryComponents.forEach(component => {
        const status = component.hasDoc ? '✅' : '⏳'
        newComponentList += `- [${component.name}](./components/${component.name}.md) - ${getComponentDescription(component.name)} ${status}\n`
      })
      
      newComponentList += '\n'
    })
    
    // 替换组件列表部分
    const startMarker = '### 🏗️ 布局组件'
    const endMarker = '> ✅ 已完成 | ⏳ 待完成'
    
    const startIndex = content.indexOf(startMarker)
    const endIndex = content.indexOf(endMarker) + endMarker.length
    
    if (startIndex !== -1 && endIndex !== -1) {
      const before = content.substring(0, startIndex)
      const after = content.substring(endIndex)
      content = before + newComponentList + after
    }
    
    fs.writeFileSync(CONFIG.mainIndexFile, content, 'utf8')
    console.log('✅ 主文档索引已更新')
  } catch (error) {
    console.error('❌ 更新主文档索引失败:', error.message)
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🔍 扫描组件目录...')
  const components = scanComponents()
  
  console.log('📊 生成统计信息...')
  const stats = generateStats(components)
  
  console.log('📝 生成文档索引...')
  const indexContent = generateIndexContent(components, stats)
  
  try {
    fs.writeFileSync(CONFIG.indexFile, indexContent, 'utf8')
    console.log('✅ 组件文档索引已生成')
  } catch (error) {
    console.error('❌ 生成文档索引失败:', error.message)
  }
  
  console.log('🔄 更新主文档索引...')
  updateMainIndex(components, stats)
  
  // 输出统计信息
  console.log('\n📈 统计信息:')
  console.log(`总组件数: ${stats.total}`)
  console.log(`已文档化: ${stats.documented}`)
  console.log(`完成度: ${Math.round((stats.documented / stats.total) * 100)}%`)
  
  Object.entries(stats.categories).forEach(([category, categoryStats]) => {
    const percentage = Math.round((categoryStats.documented / categoryStats.count) * 100)
    console.log(`${category}: ${categoryStats.documented}/${categoryStats.count} (${percentage}%)`)
  })
}

// 运行脚本
if (require.main === module) {
  main()
}

module.exports = {
  scanComponents,
  generateStats,
  generateIndexContent,
  updateMainIndex
}
