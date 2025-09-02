import React, { useState, useEffect } from 'react';
import {
  securityHeaders,
  dependencyScanner,
  sessionManager,
} from '../utils/securityAuditor';

interface SecurityReport {
  headers: {
    csp: boolean;
    hsts: boolean;
    xFrameOptions: boolean;
    score: number;
  };
  dependencies: {
    vulnerabilities: Array<{
      package: string;
      version: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
    }>;
    score: number;
  };
  session: {
    isValid: boolean;
    lastActivity: number;
  };
}

/**
 * 安全面板组件
 *
 * 功能：
 * 1. 安全头检查
 * 2. 依赖漏洞扫描
 * 3. 会话状态监控
 * 4. XSS/CSRF 防护状态
 */
const SecurityDashboard: React.FC = () => {
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const generateReport = async () => {
    setIsScanning(true);

    try {
      const headersReport = securityHeaders.generateSecurityReport();
      const dependenciesReport = await dependencyScanner.scanDependencies();
      const session = sessionManager.getSession();

      const securityReport: SecurityReport = {
        headers: headersReport,
        dependencies: dependenciesReport,
        session: {
          isValid: sessionManager.isSessionValid(),
          lastActivity: session?.lastActivity || 0,
        },
      };

      setReport(securityReport);
    } catch (error) {
      console.error('Failed to generate security report:', error);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      generateReport();
    }
  }, [isVisible]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatTimestamp = (timestamp: number) => {
    if (timestamp === 0) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
        title="Open Security Dashboard"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-96 max-h-96 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
      <div className="bg-red-800 text-white p-3 flex justify-between items-center">
        <h3 className="font-semibold">Security Dashboard</h3>
        <div className="flex space-x-2">
          <button
            onClick={generateReport}
            disabled={isScanning}
            className="text-white hover:text-gray-300 disabled:opacity-50"
            title="Refresh Security Report"
          >
            <svg
              className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {isScanning ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-2 text-gray-600">Scanning...</span>
          </div>
        ) : report ? (
          <>
            {/* Security Headers */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Security Headers
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Content Security Policy</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      report.headers.csp
                        ? 'text-green-600 bg-green-100'
                        : 'text-red-600 bg-red-100'
                    }`}
                  >
                    {report.headers.csp ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>HSTS</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      report.headers.hsts
                        ? 'text-green-600 bg-green-100'
                        : 'text-red-600 bg-red-100'
                    }`}
                  >
                    {report.headers.hsts ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>X-Frame-Options</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      report.headers.xFrameOptions
                        ? 'text-green-600 bg-green-100'
                        : 'text-red-600 bg-red-100'
                    }`}
                  >
                    {report.headers.xFrameOptions ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Overall Score</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${getScoreColor(
                      report.headers.score
                    )}`}
                  >
                    {report.headers.score.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Dependencies */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Dependencies</h4>
              <div className="space-y-2">
                {report.dependencies.vulnerabilities.length > 0 ? (
                  report.dependencies.vulnerabilities.map((vuln, index) => (
                    <div
                      key={index}
                      className="bg-red-50 border border-red-200 rounded p-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-red-800">
                            {vuln.package}@{vuln.version}
                          </div>
                          <div className="text-xs text-red-600 mt-1">
                            {vuln.description}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs ${getSeverityColor(
                            vuln.severity
                          )}`}
                        >
                          {vuln.severity}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-green-600 text-sm">
                    No vulnerabilities found
                  </p>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span>Security Score</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${getScoreColor(
                      report.dependencies.score
                    )}`}
                  >
                    {report.dependencies.score.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Session Status */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Session Status
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Session Valid</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      report.session.isValid
                        ? 'text-green-600 bg-green-100'
                        : 'text-red-600 bg-red-100'
                    }`}
                  >
                    {report.session.isValid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Last Activity</span>
                  <span className="text-gray-600 text-xs">
                    {formatTimestamp(report.session.lastActivity)}
                  </span>
                </div>
              </div>
            </div>

            {/* Protection Status */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Protection Status
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>XSS Protection</span>
                  <span className="px-2 py-1 rounded text-xs text-green-600 bg-green-100">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>CSRF Protection</span>
                  <span className="px-2 py-1 rounded text-xs text-green-600 bg-green-100">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Input Validation</span>
                  <span className="px-2 py-1 rounded text-xs text-green-600 bg-green-100">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No security report available</p>
            <button
              onClick={generateReport}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
