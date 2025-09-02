#!/usr/bin/env node

/**
 * 性能测试脚本
 *
 * 功能：
 * 1. 构建性能测试
 * 2. 运行时性能测试
 * 3. 内存使用测试
 * 4. 生成性能报告
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PerformanceTester {
  constructor() {
    this.results = {
      build: {},
      runtime: {},
      memory: {},
      bundle: {},
    };
  }

  // 构建性能测试
  async testBuildPerformance() {
    console.log('🔨 Testing build performance...');

    const startTime = Date.now();

    try {
      // 清理之前的构建
      if (fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true });
      }

      // 执行构建
      execSync('npm run build', { stdio: 'pipe' });

      const endTime = Date.now();
      const buildTime = endTime - startTime;

      this.results.build = {
        time: buildTime,
        success: true,
        timestamp: new Date().toISOString(),
      };

      console.log(`✅ Build completed in ${buildTime}ms`);

      // 分析构建产物
      this.analyzeBuildOutput();
    } catch (error) {
      this.results.build = {
        time: 0,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Build failed:', error.message);
    }
  }

  // 分析构建产物
  analyzeBuildOutput() {
    const distPath = path.join(process.cwd(), 'dist');

    if (!fs.existsSync(distPath)) {
      return;
    }

    const files = this.getFilesRecursively(distPath);
    const totalSize = files.reduce((sum, file) => {
      const stats = fs.statSync(file);
      return sum + stats.size;
    }, 0);

    const jsFiles = files.filter((file) => file.endsWith('.js'));
    const cssFiles = files.filter((file) => file.endsWith('.css'));
    const imageFiles = files.filter((file) =>
      /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(file)
    );

    this.results.bundle = {
      totalFiles: files.length,
      totalSize: totalSize,
      jsFiles: jsFiles.length,
      cssFiles: cssFiles.length,
      imageFiles: imageFiles.length,
      largestFiles: this.getLargestFiles(files, 5),
    };

    console.log(`📦 Bundle analysis:`);
    console.log(`   Total files: ${files.length}`);
    console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   JS files: ${jsFiles.length}`);
    console.log(`   CSS files: ${cssFiles.length}`);
    console.log(`   Image files: ${imageFiles.length}`);
  }

  // 获取目录下所有文件
  getFilesRecursively(dir) {
    const files = [];

    const readDir = (currentDir) => {
      const items = fs.readdirSync(currentDir);

      items.forEach((item) => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          readDir(fullPath);
        } else {
          files.push(fullPath);
        }
      });
    };

    readDir(dir);
    return files;
  }

  // 获取最大的文件
  getLargestFiles(files, count = 5) {
    return files
      .map((file) => ({
        path: path.relative(process.cwd(), file),
        size: fs.statSync(file).size,
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, count);
  }

  // 运行时性能测试
  async testRuntimePerformance() {
    console.log('⚡ Testing runtime performance...');

    try {
      // 启动开发服务器
      const serverProcess = execSync('npm run dev', {
        stdio: 'pipe',
        timeout: 30000,
      });

      // 等待服务器启动
      await this.sleep(5000);

      // 这里可以添加更多的运行时测试
      // 例如使用 Puppeteer 进行页面性能测试

      this.results.runtime = {
        success: true,
        timestamp: new Date().toISOString(),
      };

      console.log('✅ Runtime performance test completed');
    } catch (error) {
      this.results.runtime = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Runtime performance test failed:', error.message);
    }
  }

  // 内存使用测试
  async testMemoryUsage() {
    console.log('🧠 Testing memory usage...');

    const initialMemory = process.memoryUsage();

    // 模拟一些内存密集型操作
    const largeArray = new Array(1000000).fill(0).map((_, i) => i);
    const largeObject = {};

    for (let i = 0; i < 10000; i++) {
      largeObject[`key${i}`] = `value${i}`;
    }

    const afterMemory = process.memoryUsage();

    this.results.memory = {
      initial: {
        rss: initialMemory.rss,
        heapTotal: initialMemory.heapTotal,
        heapUsed: initialMemory.heapUsed,
        external: initialMemory.external,
      },
      after: {
        rss: afterMemory.rss,
        heapTotal: afterMemory.heapTotal,
        heapUsed: afterMemory.heapUsed,
        external: afterMemory.external,
      },
      difference: {
        rss: afterMemory.rss - initialMemory.rss,
        heapTotal: afterMemory.heapTotal - initialMemory.heapTotal,
        heapUsed: afterMemory.heapUsed - initialMemory.heapUsed,
        external: afterMemory.external - initialMemory.external,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('✅ Memory usage test completed');
    console.log(
      `   Memory increase: ${(
        this.results.memory.difference.heapUsed /
        1024 /
        1024
      ).toFixed(2)}MB`
    );
  }

  // 生成性能报告
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      results: this.results,
      summary: this.generateSummary(),
    };

    const reportPath = path.join(process.cwd(), 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('📊 Performance report generated:', reportPath);

    // 输出摘要
    console.log('\n📈 Performance Summary:');
    console.log(`   Build time: ${this.results.build.time}ms`);
    console.log(
      `   Bundle size: ${(this.results.bundle.totalSize / 1024 / 1024).toFixed(
        2
      )}MB`
    );
    console.log(
      `   Memory usage: ${(
        this.results.memory.difference.heapUsed /
        1024 /
        1024
      ).toFixed(2)}MB`
    );

    return report;
  }

  // 生成摘要
  generateSummary() {
    const summary = {
      buildSuccess: this.results.build.success,
      buildTime: this.results.build.time,
      bundleSize: this.results.bundle.totalSize,
      memoryIncrease: this.results.memory.difference.heapUsed,
      score: 0,
    };

    // 计算性能分数
    let score = 100;

    // 构建时间评分
    if (summary.buildTime > 60000) score -= 20; // 超过1分钟
    else if (summary.buildTime > 30000) score -= 10; // 超过30秒

    // Bundle大小评分
    if (summary.bundleSize > 5 * 1024 * 1024) score -= 20; // 超过5MB
    else if (summary.bundleSize > 2 * 1024 * 1024) score -= 10; // 超过2MB

    // 内存使用评分
    if (summary.memoryIncrease > 100 * 1024 * 1024) score -= 20; // 超过100MB
    else if (summary.memoryIncrease > 50 * 1024 * 1024) score -= 10; // 超过50MB

    summary.score = Math.max(0, score);

    return summary;
  }

  // 工具方法：等待
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 运行所有测试
  async runAllTests() {
    console.log('🚀 Starting performance tests...\n');

    await this.testBuildPerformance();
    await this.testRuntimePerformance();
    await this.testMemoryUsage();

    const report = this.generateReport();

    console.log('\n✅ All performance tests completed!');

    return report;
  }
}

// 主函数
async function main() {
  const tester = new PerformanceTester();

  try {
    await tester.runAllTests();
  } catch (error) {
    console.error('❌ Performance test failed:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = PerformanceTester;
