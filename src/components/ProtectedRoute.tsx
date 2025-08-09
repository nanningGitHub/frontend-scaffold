import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { PageLoading } from './LoadingSpinner';

/**
 * 受保护的路由组件
 *
 * 功能：
 * 1. 检查用户认证状态
 * 2. 未认证用户重定向到登录页
 * 3. 保存原始访问路径
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <PageLoading />;
  }

  // 如果用户未认证，重定向到登录页
  if (!isAuthenticated) {
    // 保存当前路径，登录后可以重定向回来
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 用户已认证，渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute;
