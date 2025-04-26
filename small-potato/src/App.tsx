import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { message, Spin, App as AntApp } from 'antd';
import MainLayout from './layouts/MainLayout';
import { 
  Home, 
  Explore, 
  Login, 
  Register, 
  NoteDetail, 
  PublishNote, 
  UserProfile, 
  NotFound, 
  Search,
} from './pages';
import './App.scss';

// 加载中组件
const Loading = () => (
  <div className="page-loading">
    <Spin size="large" />
  </div>
);

const App: React.FC = () => {
  // App组件已经内置处理了message等组件的渲染，不需要额外配置
  // 移除旧的message.config配置

  return (
    <AntApp>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 主布局路由 */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="note/:id" element={<NoteDetail />} />
            <Route path="user/:id" element={<UserProfile />} />
            <Route path="search" element={<Search />} />
            <Route path="publish" element={<PublishNote />} />
          </Route>
          
          {/* 独立路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 404 路由 */}
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </AntApp>
  );
};

export default App;
