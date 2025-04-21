import { get, post, put, upload } from './request';

// 用户信息接口
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  bio: string;
  gender: 'male' | 'female' | 'unknown';
  following: number;
  followers: number;
  noteCount: number;
  likeCount: number;
  isFollowed: boolean;
  createdAt: string;
  updatedAt: string;
}

// 登录参数
export interface LoginParams {
  username: string;
  password: string;
}

// 注册参数
export interface RegisterParams {
  username: string;
  password: string;
  nickname: string;
}

// 用户登录
export function login(data: LoginParams) {
  return post<{ token: string; userInfo: UserInfo }>('/user/login', data);
}

// 用户注册
export function register(data: RegisterParams) {
  return post<{ token: string; userInfo: UserInfo }>('/user/register', data);
}

// 获取当前用户信息
export function getCurrentUser() {
  return get<UserInfo>('/user/current');
}

// 获取用户信息
export function getUserInfo(userId: string) {
  return get<UserInfo>(`/user/${userId}`);
}

// 更新用户信息
export function updateUserInfo(data: {
  nickname?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'unknown';
}) {
  return put<UserInfo>('/user/profile', data);
}

// 上传用户头像
export function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return upload<{ url: string }>('/upload/avatar', formData);
}

// 关注用户
export function followUser(userId: string) {
  return post(`/user/follow/${userId}`);
}

// 取消关注
export function unfollowUser(userId: string) {
  return post(`/user/unfollow/${userId}`);
}

// 获取关注列表
export function getFollowingList(params: { userId: string; page: number; pageSize: number }) {
  return get('/user/following', params);
}

// 获取粉丝列表
export function getFollowersList(params: { userId: string; page: number; pageSize: number }) {
  return get('/user/followers', params);
}

// 获取用户收藏的笔记
export function getUserCollections(params: { page: number; pageSize: number }) {
  return get('/user/collections', params);
}

// 获取用户点赞的笔记
export function getUserLikes(params: { page: number; pageSize: number }) {
  return get('/user/likes', params);
} 