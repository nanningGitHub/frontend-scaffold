module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 提交类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式调整（不影响代码运行的变动）
        'refactor', // 重构（既不是新增功能，也不是修改bug的代码变动）
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'ci', // CI/CD相关
        'build', // 构建系统或外部依赖的变动
        'revert', // 回滚到上一个版本
      ],
    ],
    // 类型不能为空
    'type-empty': [2, 'never'],
    // 主题不能为空
    'subject-empty': [2, 'never'],
    // 主题以句号结尾
    'subject-full-stop': [2, 'never', '.'],
    // 主题最大长度
    'subject-max-length': [2, 'always', 72],
    // 主题最小长度
    'subject-min-length': [2, 'always', 3],
    // 主题格式：小写开头
    'subject-case': [2, 'always', 'lower-case'],
    // 正文最大行长度
    'body-max-line-length': [2, 'always', 100],
    // 页脚最大行长度
    'footer-max-line-length': [2, 'always', 100],
    // 范围格式：小写
    'scope-case': [2, 'always', 'lower-case'],
  },
};
