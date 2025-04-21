import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Button, 
  Input, 
  Avatar, 
  Dropdown, 
  Space, 
  Badge,
  Divider
} from 'antd';
import type { MenuProps } from 'antd';
import { 
  HomeOutlined, 
  CompassOutlined, 
  BellOutlined, 
  UserOutlined, 
  EditOutlined,
  LogoutOutlined,
  HeartOutlined,
  StarOutlined,
  SettingOutlined,
  SearchOutlined
} from '@ant-design/icons';
import useUserStore from '../../stores/userStore';
import './style.scss';

const { Header } = Layout;
const { Search } = Input;

// 头部导航组件
const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, isLoggedIn, logout } = useUserStore();
  const [current, setCurrent] = useState(location.pathname);

  // 监听路由变化，更新当前选中菜单
  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname]);

  // 处理菜单点击
  const handleMenuClick = (e: { key: string }) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(value.trim())}`);
    }
  };

  // 处理登出
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 用户菜单项
  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: <Link to={`/user/${userInfo?.id}`}>个人主页</Link>,
      icon: <UserOutlined />
    },
    {
      key: '2',
      label: <Link to="/user/likes">我的点赞</Link>,
      icon: <HeartOutlined />
    },
    {
      key: '3',
      label: <Link to="/user/collections">我的收藏</Link>,
      icon: <StarOutlined />
    },
    {
      key: 'divider',
      type: 'divider'
    },
    {
      key: '4',
      label: <Link to="/settings">设置</Link>,
      icon: <SettingOutlined />
    },
    {
      key: '5',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    },
  ];

  return (
    <Header className="app-header">
      <div className="header-wrapper">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src="data:image/png;base64,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" alt="小红书" />
            <span>小红书</span>
          </Link>
        </div>

        {/* 主导航 */}
        <Menu
          mode="horizontal"
          selectedKeys={[current]}
          onClick={handleMenuClick}
          className="main-menu"
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
            }
          ]}
        />

        {/* 搜索框 */}
        <div className="search-box">
          <Search
            placeholder="搜索内容、用户、标签"
            allowClear
            onSearch={handleSearch}
            className="search-input"
            prefix={<SearchOutlined />}
          />
        </div>

        {/* 右侧功能区 */}
        <div className="header-right">
          {isLoggedIn ? (
            <>
              {/* 发布按钮 */}
              <Button 
                type="primary" 
                shape="round" 
                icon={<EditOutlined />}
                onClick={() => navigate('/publish')}
                className="publish-btn"
              >
                发布
              </Button>

              {/* 消息通知 */}
              <Badge count={5} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined />} 
                  onClick={() => navigate('/notifications')}
                  className="notification-btn"
                />
              </Badge>

              {/* 用户头像和下拉菜单 */}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div className="user-avatar">
                  <Avatar src={userInfo?.avatar} icon={<UserOutlined />} />
                </div>
              </Dropdown>
            </>
          ) : (
            <Space>
              <Button onClick={() => navigate('/login')}>登录</Button>
              <Button type="primary" onClick={() => navigate('/register')}>注册</Button>
            </Space>
          )}
        </div>
      </div>
    </Header>
  );
};

export default AppHeader; 