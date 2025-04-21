import React, { useEffect } from 'react';
import { Layout, BackTop } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from '../../components/Header';
import useUserStore from '../../stores/userStore';
import './style.scss';

const { Content, Footer } = Layout;

// 主布局组件
const MainLayout: React.FC = () => {
  const { fetchUserInfo } = useUserStore();

  // 组件挂载时获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return (
    <Layout className="main-layout">
      {/* 头部导航 */}
      <AppHeader />
      
      {/* 主内容区 */}
      <Content className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </Content>
      
      {/* 页脚 */}
      <Footer className="main-footer">
        <div className="footer-links">
          <a href="#" target="_blank" rel="noopener noreferrer">关于我们</a>
          <a href="#" target="_blank" rel="noopener noreferrer">使用条款</a>
          <a href="#" target="_blank" rel="noopener noreferrer">隐私政策</a>
          <a href="#" target="_blank" rel="noopener noreferrer">帮助中心</a>
        </div>
        <div className="footer-copyright">
          小红书 &copy; {new Date().getFullYear()} 版权所有
        </div>
      </Footer>
      
      {/* 回到顶部 */}
      <BackTop />
    </Layout>
  );
};

export default MainLayout; 