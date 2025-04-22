import React, { useEffect } from 'react';
import { Layout, BackTop, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  CompassOutlined, 
  UserOutlined, 
  EditOutlined,
  HeartOutlined,
  StarOutlined,
  FireOutlined,
  BookOutlined,
  SettingOutlined
} from '@ant-design/icons';
import AppHeader from '../../components/Header';
import useUserStore from '../../stores/userStore';
import './style.scss';

const { Content, Footer, Sider } = Layout;

// 主布局组件
const MainLayout: React.FC = () => {
  const { fetchUserInfo, userInfo, isLoggedIn } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 组件挂载时获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  // 处理侧边栏菜单点击
  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  return (
    <Layout className="main-layout">
      {/* 头部导航 */}
      <AppHeader />
      
      <Layout className="site-layout">
        {/* 侧边栏 */}
        <Sider 
          width={200} 
          className="site-sidebar"
          breakpoint="lg"
          collapsedWidth="0"
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
            className="sidebar-menu"
            items={[
              {
                key: '/',
                icon: <HomeOutlined />,
                label: '首页'
              },
              {
                key: '/explore',
                icon: <CompassOutlined />,
                label: '发现'
              },
              {
                key: '/hot',
                icon: <FireOutlined />,
                label: '热门'
              },
              {
                type: 'divider'
              },
              ...(true ? [
                {
                  key: `/user/${userInfo?.id}`,
                  icon: <UserOutlined />,
                  label: '个人主页'
                },
                {
                  key: '/publish',
                  icon: <EditOutlined />,
                  label: '发布笔记'
                },
                {
                  key: '/user/notes',
                  icon: <BookOutlined />,
                  label: '我的笔记'
                },
                {
                  key: '/user/likes',
                  icon: <HeartOutlined />,
                  label: '我的点赞'
                },
                {
                  key: '/user/collections',
                  icon: <StarOutlined />,
                  label: '我的收藏'
                },
                {
                  key: '/settings',
                  icon: <SettingOutlined />,
                  label: '设置'
                },
              ] : [])
            ]}
          />
        </Sider>
        
        {/* 主内容区 */}
        <Content className="main-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </Layout>
      
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