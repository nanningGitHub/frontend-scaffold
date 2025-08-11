import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
  createdAt: string;
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

/**
 * 用户状态管理 Store
 * 使用 Pinia 进行状态管理，支持与主应用的状态同步
 */
export const useUserStore = defineStore('user', () => {
  // 状态
  const users = ref<User[]>([]);

  const currentUser = ref<CurrentUser | null>(null);

  const loading = ref(false);
  const error = ref<string | null>(null);

  // 计算属性
  const totalUsers = computed(() => users.value.length);
  const activeUsers = computed(
    () => users.value.filter((u) => u.status === 'active').length
  );
  const adminUsers = computed(
    () => users.value.filter((u) => u.role === 'admin').length
  );
  const regularUsers = computed(
    () => users.value.filter((u) => u.role === 'user').length
  );

  const isAdmin = computed(() => currentUser.value?.role === 'admin');
  const isAuthenticated = computed(() => currentUser.value !== null);

  // 方法
  const setUsers = (newUsers: User[]) => {
    users.value = newUsers;
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser = {
      ...user,
      id: Date.now(),
      createdAt: new Date().toLocaleString(),
    };
    users.value.push(newUser);

    // 发送用户更新消息到主应用
    sendUserUpdateMessage('add', newUser);
  };

  const updateUser = (id: number, updates: Partial<User>) => {
    const index = users.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates };

      // 发送用户更新消息到主应用
      sendUserUpdateMessage('update', users.value[index]);
    }
  };

  const deleteUser = (id: number) => {
    const index = users.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      const deletedUser = users.value[index];
      users.value.splice(index, 1);

      // 发送用户更新消息到主应用
      sendUserUpdateMessage('delete', deletedUser);
    }
  };

  const setCurrentUser = (user: CurrentUser | null) => {
    currentUser.value = user;
  };

  const clearCurrentUser = () => {
    currentUser.value = null;
  };

  const setLoading = (status: boolean) => {
    loading.value = status;
  };

  const setError = (message: string | null) => {
    error.value = message;
  };

  const clearError = () => {
    error.value = null;
  };

  const sendUserUpdateMessage = (
    action: 'add' | 'update' | 'delete',
    user: User
  ) => {
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'USER_UPDATE',
          payload: { action, user },
          source: 'vue-micro-app',
        },
        '*'
      );
    }
  };

  const sendStoreState = () => {
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'STORE_STATE',
          payload: {
            totalUsers: totalUsers.value,
            activeUsers: activeUsers.value,
            adminUsers: adminUsers.value,
            regularUsers: regularUsers.value,
            currentUser: currentUser.value,
          },
          source: 'vue-micro-app',
        },
        '*'
      );
    }
  };

  const initializeMessageListener = () => {
    window.addEventListener('message', (event) => {
      if (event.data?.source === 'react-host') {
        switch (event.data.type) {
          case 'GET_STORE_STATE':
            sendStoreState();
            break;
          case 'SET_USERS':
            setUsers(event.data.payload.users);
            break;
          case 'SET_CURRENT_USER':
            setCurrentUser(event.data.payload.user);
            break;
          default:
            // 处理其他消息类型
            break;
        }
      }
    });
  };

  return {
    // 状态
    users,
    currentUser,
    loading,
    error,

    // 计算属性
    totalUsers,
    activeUsers,
    adminUsers,
    regularUsers,
    isAdmin,
    isAuthenticated,

    // 方法
    setUsers,
    addUser,
    updateUser,
    deleteUser,
    setCurrentUser,
    clearCurrentUser,
    setLoading,
    setError,
    clearError,
    sendUserUpdateMessage,
    sendStoreState,
    initializeMessageListener,
  };
});
