# 小红书系统前端项目

基于React 18 + TypeScript + Ant Design开发的小红书系统前端页面。

## 技术栈

- React 18
- TypeScript
- Ant Design 5.x
- React Router 6
- Zustand (状态管理)
- Axios (HTTP请求)
- Sass (样式处理)

## 功能特性

- 现代美观的界面设计
- 响应式布局，适配各种屏幕尺寸
- 笔记发布功能（图文编辑、图片上传）
- 笔记列表展示（支持点赞、评论）
- 用户个人中心
- 标签分类浏览

## 目录结构

```
src/
  ├── api/          # API接口封装
  ├── assets/       # 静态资源
  ├── components/   # 公共组件
  ├── hooks/        # 自定义钩子
  ├── layouts/      # 布局组件
  ├── pages/        # 页面组件
  ├── stores/       # 状态管理
  ├── styles/       # 全局样式
  └── utils/        # 工具函数
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

## HTTP接口文档

以下是后端API接口文档，供后端开发人员参考实现。

### 基础URL

```
/api
```

### 认证相关接口

#### 登录

- **URL**: `/user/login`
- **Method**: `POST`
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "token": "string",
      "userInfo": {
        "id": "string",
        "username": "string",
        "nickname": "string",
        "avatar": "string",
        "bio": "string",
        "gender": "string",
        "following": 0,
        "followers": 0,
        "noteCount": 0,
        "likeCount": 0,
        "isFollowed": false,
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

#### 注册

- **URL**: `/user/register`
- **Method**: `POST`
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string",
    "nickname": "string"
  }
  ```
- **响应**: 同登录接口

#### 获取当前用户信息

- **URL**: `/user/current`
- **Method**: `GET`
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",
      "username": "string",
      "nickname": "string",
      "avatar": "string",
      "bio": "string",
      "gender": "string",
      "following": 0,
      "followers": 0,
      "noteCount": 0,
      "likeCount": 0,
      "isFollowed": false,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 笔记相关接口

#### 获取笔记列表

- **URL**: `/notes`
- **Method**: `GET`
- **参数**:
  - `page`: 页码 (默认1)
  - `pageSize`: 每页数量 (默认20)
  - `userId`: 用户ID (可选，筛选指定用户的笔记)
  - `tag`: 标签 (可选，筛选指定标签的笔记)
  - `keyword`: 关键词 (可选，搜索笔记标题或内容)
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "total": 0,
      "list": [
        {
          "id": "string",
          "title": "string",
          "content": "string",
          "images": ["string"],
          "userId": "string",
          "username": "string",
          "avatar": "string",
          "tags": ["string"],
          "likeCount": 0,
          "commentCount": 0,
          "collectCount": 0,
          "isLiked": false,
          "isCollected": false,
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "page": 1,
      "pageSize": 20
    }
  }
  ```

#### 获取笔记详情

- **URL**: `/notes/{id}`
- **Method**: `GET`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",
      "title": "string",
      "content": "string",
      "images": ["string"],
      "userId": "string",
      "username": "string",
      "avatar": "string",
      "tags": ["string"],
      "likeCount": 0,
      "commentCount": 0,
      "collectCount": 0,
      "isLiked": false,
      "isCollected": false,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### 创建笔记

- **URL**: `/notes`
- **Method**: `POST`
- **请求头**: `Authorization: Bearer {token}`
- **请求体**:
  ```json
  {
    "title": "string",
    "content": "string",
    "tags": ["string"],
    "images": ["string"]
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",
      "title": "string",
      "content": "string",
      "images": ["string"],
      "userId": "string",
      "username": "string",
      "avatar": "string",
      "tags": ["string"],
      "likeCount": 0,
      "commentCount": 0,
      "collectCount": 0,
      "isLiked": false,
      "isCollected": false,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### 上传笔记图片

- **URL**: `/upload/note-image`
- **Method**: `POST`
- **请求头**: 
  - `Authorization: Bearer {token}`
  - `Content-Type: multipart/form-data`
- **请求体**: 
  - `file`: 图片文件
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "url": "string"
    }
  }
  ```

#### 点赞笔记

- **URL**: `/notes/{id}/like`
- **Method**: `POST`
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

#### 取消点赞

- **URL**: `/notes/{id}/unlike`
- **Method**: `POST`
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

#### 收藏笔记

- **URL**: `/notes/{id}/collect`
- **Method**: `POST`
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

#### 取消收藏

- **URL**: `/notes/{id}/uncollect`
- **Method**: `POST`
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

### 用户相关接口

#### 获取用户信息

- **URL**: `/user/{id}`
- **Method**: `GET`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",
      "username": "string",
      "nickname": "string",
      "avatar": "string",
      "bio": "string",
      "gender": "string",
      "following": 0,
      "followers": 0,
      "noteCount": 0,
      "likeCount": 0,
      "isFollowed": false,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

#### 关注用户

- **URL**: `/user/follow/{userId}`
- **Method**: `POST`
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

#### 取消关注

- **URL**: `/user/unfollow/{userId}`
- **Method**: `POST`
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

### 评论相关接口

#### 获取笔记评论

- **URL**: `/notes/{noteId}/comments`
- **Method**: `GET`
- **参数**:
  - `page`: 页码 (默认1)
  - `pageSize`: 每页数量 (默认20)
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "total": 0,
      "list": [
        {
          "id": "string",
          "content": "string",
          "userId": "string",
          "username": "string",
          "avatar": "string",
          "noteId": "string",
          "createdAt": "string"
        }
      ],
      "page": 1,
      "pageSize": 20
    }
  }
  ```

#### 发表评论

- **URL**: `/notes/{noteId}/comments`
- **Method**: `POST`
- **请求头**: `Authorization: Bearer {token}`
- **请求体**:
  ```json
  {
    "content": "string"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",
      "content": "string",
      "userId": "string",
      "username": "string",
      "avatar": "string",
      "noteId": "string",
      "createdAt": "string"
    }
  }
  ```

#### 删除评论

- **URL**: `/notes/{noteId}/comments/{commentId}`
- **Method**: `DELETE`
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

## 状态码说明

- 200: 成功
- 400: 请求参数错误
- 401: 未授权（token无效或已过期）
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误
