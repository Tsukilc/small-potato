import { get, post, put, del, upload } from './request';
// 移除对@/utils/request和@/types的导入
// import { request } from '@/utils/request';
// import { type NoteType, type CommentType } from '@/types';

// 笔记类型定义
export interface Note {
  id: string;
  title: string;
  content: string;
  images: string[];
  userId: string;
  username: string;
  avatar: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  collectCount: number;
  isLiked: boolean;
  isCollected: boolean;
  isFollowed?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 评论类型定义
export interface Comment {
  id: string;
  noteId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 笔记分页参数
export interface NoteQueryParams {
  page: number;
  pageSize: number;
  userId?: string;
  tag?: string;
  keyword?: string;
}

// 笔记分页结果
export interface NotePaginationResult {
  total: number;
  list: Note[];
  page: number;
  pageSize: number;
}

// 评论分页结果
export interface CommentPaginationResult {
  total: number;
  list: Comment[];
  page: number;
  pageSize: number;
}

// 获取笔记列表
export function getNoteList(params: NoteQueryParams) {
  return get<NotePaginationResult>('/notes', params);
}

// 获取笔记详情
export function getNoteDetail(id: string) {
  return get<Note>(`/notes/${id}`);
}

// 创建笔记
export function createNote(data: {
  title: string;
  content: string;
  tags: string[];
  images: string[];
}) {
  return post<Note>('/notes', data);
}

// 更新笔记
export function updateNote(id: string, data: {
  title?: string;
  content?: string;
  tags?: string[];
  images?: string[];
}) {
  return post<Note>(`/notes/${id}`, data);
}

// 删除笔记
export function deleteNote(id: string) {
  return del(`/notes/${id}`);
}

// 上传笔记图片
export function uploadNoteImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return upload<{ url: string }>('/upload/note-image', formData);
}

// 点赞笔记
export function likeNote(noteId: string) {
  return post(`/notes/${noteId}/like`);
}

// 取消点赞
export function unlikeNote(noteId: string) {
  return del(`/notes/${noteId}/like`);
}

// 收藏笔记
export function collectNote(noteId: string) {
  return post(`/notes/${noteId}/collect`);
}

// 取消收藏
export function uncollectNote(noteId: string) {
  return del(`/notes/${noteId}/collect`);
}

// 获取笔记评论
export function getNoteComments(noteId: string, params: { page: number; pageSize: number }) {
  return get<CommentPaginationResult>(`/notes/${noteId}/comments`, params);
}

// 添加评论
export function addComment(noteId: string, content: string) {
  return post<Comment>(`/notes/${noteId}/comments`, { content });
}

// 删除评论
export function deleteComment(commentId: string) {
  return del(`/comments/${commentId}`);
}

// 关注用户
export function followUser(userId: string) {
  return post(`/users/${userId}/follow`);
}

// 取消关注
export function unfollowUser(userId: string) {
  return del(`/users/${userId}/follow`);
}

// 获取推荐笔记
export function getRecommendedNotes(limit = 5) {
  return get<Note[]>('/notes/recommended', { limit });
}

// 获取相关笔记
export function getRelatedNotes(noteId: string, limit = 5) {
  return get<Note[]>(`/notes/${noteId}/related`, { limit });
}

// 举报笔记
export function reportNote(noteId: string, reason: string) {
  return post(`/notes/${noteId}/report`, { reason });
}

// 分享笔记计数接口
export function shareNote(noteId: string, platform: string) {
  return post(`/notes/${noteId}/share`, { platform });
} 