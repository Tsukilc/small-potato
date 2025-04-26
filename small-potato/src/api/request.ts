import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://10.21.32.14:80/api', // 基础URL，可根据环境变量配置
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// API基础URL，用于拼接API请求路径
export const API_BASE_URL = 'http://10.21.32.14:80/api';

// 文件服务器地址，用于访问静态资源
export const FILE_SERVER_URL = 'http://10.21.32.14:80';

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 根据后端返回的状态码进行处理
    if (res.code === 200) {
      return res.data;
    } else {
      message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          message.error('登录状态已过期，请重新登录');
          // 可以在这里处理登出逻辑
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误，请联系管理员');
          break;
        default:
          message.error(error.message || '请求失败');
      }
    } else {
      message.error('网络异常，请检查您的网络连接');
    }
    return Promise.reject(error);
  }
);

// 获取完整的资源URL（主要用于图片）
export function getFullResourceUrl(path: string): string {
  if (!path) return '';
  
  // 已经是完整URL的情况
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // 从MinIO返回的相对路径，通常是以服务器目录结构开头
  if (path.startsWith('/')) {
    return `${FILE_SERVER_URL}${path}`;
  }
  
  // 其他情况，假设是相对于API基础路径的资源
  return `${API_BASE_URL}/${path}`;
}

// 封装GET请求
export function get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return instance.get(url, { params, ...config });
}

// 封装POST请求
export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return instance.post(url, data, config);
}

// 封装PUT请求
export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return instance.put(url, data, config);
}

// 封装DELETE请求
export function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return instance.delete(url, config);
}

// 封装上传文件请求
export function upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
  return instance.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  });
}

export default instance; 