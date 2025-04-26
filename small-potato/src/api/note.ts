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

// MinIO上传URL响应
export interface UploadUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  fileName: string;
  filePath: string;
}

// 上传完成回调参数
export interface UploadCallbackParams {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  originalFileName: string;
  category: string;
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

// 获取MinIO上传URL
export function getUploadUrl(fileInfo: {
  fileName: string;
  fileType: string;
  fileSize: number;
  category?: string;
}) {
  return post<UploadUrlResponse>('/file/upload/get-url', {
    ...fileInfo
  });
}

// 上传文件到MinIO
export async function uploadFileToMinIO(uploadUrl: string, file: File) {
  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });
    
    if (response.ok) {
      return true;
    }
    throw new Error('上传到MinIO失败');
  } catch (error) {
    console.error('文件上传错误:', error);
    throw error;
  }
}

// 上传完成回调
export function uploadCallback(params: UploadCallbackParams) {
  return post('/file/upload/callback', params);
}

// 上传笔记图片 (完整流程)
export async function uploadNoteImage(file: File) {
  try {
    // 1. 从后端获取上传URL
    const uploadUrlData = await getUploadUrl({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      category: 'note'  // 分类为笔记图片
    });
    
    // 2. 上传文件到MinIO
    await uploadFileToMinIO(uploadUrlData.uploadUrl, file);
    
    // 3. 上传完成后回调通知后端
    await uploadCallback({
      fileName: uploadUrlData.fileName,
      fileUrl: uploadUrlData.fileUrl,
      fileSize: file.size,
      fileType: file.type,
      filePath: uploadUrlData.filePath,
      originalFileName: file.name,
      category: 'note',
    });
    
    // 4. 返回文件的访问URL
    return { url: uploadUrlData.fileUrl };
  } catch (error) {
    console.error('笔记图片上传失败:', error);
    throw error;
  }
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