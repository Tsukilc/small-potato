import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Avatar, 
  Button, 
  Tabs, 
  Skeleton, 
  Statistic, 
  Empty,
  Divider 
} from 'antd';
import { 
  UserOutlined,
  EditOutlined,
  HeartOutlined,
  StarOutlined
} from '@ant-design/icons';
import NoteCard from '../../components/NoteCard';
import { getUserInfo, followUser, unfollowUser } from '../../api/user';
import { getNoteList } from '../../api/note';
import useUserStore from '../../stores/userStore';
import './style.scss';

const { TabPane } = Tabs;

// 用户资料页面
const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo: currentUser, isLoggedIn } = useUserStore();
  const [userInfo, setUserInfo] = useState<ProfileUserInfo | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');
  const [isFollowed, setIsFollowed] = useState(false);
  
  // 判断是否为当前用户
  const isCurrentUser = currentUser?.id === id;

  // 用户信息接口
  interface ProfileUserInfo {
    id: string;
    username: string;
    nickname: string;
    avatar: string;
    bio: string;
    following: number;
    followers: number;
    noteCount: number;
    isFollowed: boolean;
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!id) return;
    
    try {
      const data = await getUserInfo(id);
      setUserInfo(data);
      setIsFollowed(data.isFollowed);
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  // 获取用户笔记
  const fetchUserNotes = async () => {
    if (!id) return;
    
    try {
      const data = await getNoteList({
        userId: id,
        page: 1,
        pageSize: 10
      });
      setNotes(data.list);
    } catch (error) {
      console.error('获取用户笔记失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    setLoading(true);
    fetchUserInfo();
    fetchUserNotes();
  }, [id]);

  // 处理关注/取消关注
  const handleFollowToggle = async () => {
    if (!isLoggedIn) {
      return navigate('/login');
    }
    
    if (!userInfo) return;
    
    try {
      if (isFollowed) {
        await unfollowUser(id!);
        setIsFollowed(false);
        setUserInfo(prev => {
          if (!prev) return null;
          return {
            ...prev,
            followers: prev.followers - 1
          };
        });
      } else {
        await followUser(id!);
        setIsFollowed(true);
        setUserInfo(prev => {
          if (!prev) return null;
          return {
            ...prev,
            followers: prev.followers + 1
          };
        });
      }
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  // 渲染加载状态
  if (loading) {
    return (
      <div className="user-profile-page">
        <Card className="user-card">
          <Skeleton avatar active paragraph={{ rows: 3 }} />
        </Card>
        <Card className="content-card">
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </div>
    );
  }

  // 用户不存在
  if (!userInfo) {
    return (
      <div className="user-profile-page">
        <Card className="user-not-found">
          <Empty description="用户不存在或已被删除" />
          <Button type="primary" onClick={() => navigate('/')}>返回首页</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      {/* 用户信息卡片 */}
      <Card className="user-card">
        <div className="user-info">
          <div className="avatar-container">
            <Avatar 
              size={100} 
              src={userInfo.avatar} 
              icon={<UserOutlined />}
            />
          </div>
          
          <div className="user-detail">
            <h1 className="nickname">{userInfo.nickname}</h1>
            <p className="username">@{userInfo.username}</p>
            
            {userInfo.bio && (
              <p className="bio">{userInfo.bio}</p>
            )}
            
            <div className="stats">
              <Statistic title="笔记" value={userInfo.noteCount} />
              <Statistic title="关注" value={userInfo.following} />
              <Statistic title="粉丝" value={userInfo.followers} />
            </div>
            
            <div className="action-buttons">
              {isCurrentUser ? (
                <Button 
                  icon={<EditOutlined />} 
                  onClick={() => navigate('/settings')}
                >
                  编辑资料
                </Button>
              ) : (
                <Button 
                  type={isFollowed ? "default" : "primary"}
                  onClick={handleFollowToggle}
                >
                  {isFollowed ? '已关注' : '关注'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      {/* 用户内容区域 */}
      <Card className="content-card">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
        >
          <TabPane 
            tab={<span><EditOutlined />笔记</span>} 
            key="notes"
          >
            {notes.length > 0 ? (
              <Row gutter={[16, 16]}>
                {notes.map(note => (
                  <Col xs={24} sm={12} md={8} key={note.id}>
                    <NoteCard note={note} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="暂无笔记" />
            )}
          </TabPane>
          
          <TabPane 
            tab={<span><HeartOutlined />点赞</span>} 
            key="likes"
          >
            <Empty description="暂无点赞内容" />
          </TabPane>
          
          <TabPane 
            tab={<span><StarOutlined />收藏</span>} 
            key="collections"
          >
            <Empty description="暂无收藏内容" />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserProfile; 