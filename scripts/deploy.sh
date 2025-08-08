#!/bin/bash

# 部署脚本 - 部署到 GitHub Pages

echo "🚀 开始部署到 GitHub Pages..."

# 构建项目
echo "📦 构建项目..."
npm run build

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败"
    exit 1
fi

# 如果有 gh-pages 分支，删除它
git branch -D gh-pages 2>/dev/null || true

# 创建新的 gh-pages 分支
git checkout -b gh-pages

# 删除所有文件，只保留 dist 目录
git rm -rf . || true
git clean -fxd

# 将 dist 目录的内容移动到根目录
mv dist/* . 2>/dev/null || true
rmdir dist 2>/dev/null || true

# 添加所有文件
git add .

# 提交更改
git commit -m "Deploy to GitHub Pages"

# 推送到远程仓库
git push origin gh-pages --force

# 切换回 main 分支
git checkout main

# 删除本地 gh-pages 分支
git branch -D gh-pages

echo "✅ 部署完成！"
echo "🌐 访问地址: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/"
