import { create } from 'zustand';
import { UserInfo, login as loginApi, register as registerApi, getCurrentUser } from '../api/user';

// 用户状态接口
interface UserState {
  // 用户信息
  userInfo: UserInfo | null;
  // 加载状态
  loading: boolean;
  // 是否已登录
  isLoggedIn: boolean;
  // 登录方法
  login: (username: string, password: string) => Promise<void>;
  // 注册方法
  register: (username: string, password: string, nickname: string) => Promise<void>;
  // 登出方法
  logout: () => void;
  // 获取当前用户信息
  fetchUserInfo: () => Promise<void>;
  // 设置用户信息
  setUserInfo: (userInfo: UserInfo) => void;
}

// 创建用户状态管理
const useUserStore = create<UserState>((set, get) => ({
  userInfo: null,
  loading: false,
  isLoggedIn: !!localStorage.getItem('token'),

  // 登录
  login: async (username: string, password: string) => {
    set({ loading: true });
    try {
      const res = await loginApi({ username, password });   // 保存token到本地
      localStorage.setItem('token', res.token);
      set({ 
        userInfo: res.userInfo, 
        isLoggedIn: true, 
        loading: false 
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // 注册
  register: async (username: string, password: string, nickname: string) => {
    set({ loading: true });
    try {
      const res = await registerApi({ username, password, nickname });
      // 保存token到本地
      localStorage.setItem('token', res.token);
      set({ 
        userInfo: res.userInfo, 
        isLoggedIn: true, 
        loading: false 
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // 登出
  logout: () => {
    localStorage.removeItem('token');
    set({ 
      userInfo: null, 
      isLoggedIn: false 
    });
  },

  // 获取当前用户信息
  fetchUserInfo: async () => {
    // 检查是否有token
    const token = localStorage.getItem('token');
    if (!token) {
      set({ userInfo: null, isLoggedIn: false });
      return;
    }

    set({ loading: true });
    try {
      const userInfo = await getCurrentUser();
      set({ 
        userInfo, 
        isLoggedIn: true, 
        loading: false 
      });
    } catch (error) {
      // 如果获取失败，清除token
      localStorage.removeItem('token');
      set({ 
        userInfo: null, 
        isLoggedIn: false, 
        loading: false 
      });
    }
  },

  // 设置用户信息
  setUserInfo: (userInfo: UserInfo) => {
    set({ userInfo });
  }
}));

export default useUserStore; 