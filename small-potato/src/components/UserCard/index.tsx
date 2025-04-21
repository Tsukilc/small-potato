import React from 'react';
import { Card, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UserInfo } from '../../api/user';
import './style.scss';

interface UserCardProps {
  user: UserInfo;
  onFollowChange?: (id: string, followed: boolean) => void;
}

// 用户卡片组件
const UserCard: React.FC<UserCardProps> = ({ user, onFollowChange }) => {
  const navigate = useNavigate();
  
  // 处理用户点击
  const handleUserClick = () => {
    navigate(`/user/${user.id}`);
  };
  
  // 处理关注/取消关注
  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFollowChange) {
      onFollowChange(user.id, !user.isFollowed);
    }
  };
  
  return (
    <Card className="user-card" onClick={handleUserClick}>
      <div className="user-card-content">
        <Avatar 
          size={64} 
          src={user.avatar} 
          icon={<UserOutlined />}
          className="user-avatar"
        />
        
        <div className="user-info">
          <h3 className="nickname">{user.nickname}</h3>
          <p className="username">@{user.username}</p>
          
          {user.bio && (
            <p className="bio">{user.bio}</p>
          )}
          
          <div className="user-stats">
            <span className="stat-item">
              <strong>{user.noteCount}</strong> 笔记
            </span>
            <span className="stat-item">
              <strong>{user.followers}</strong> 粉丝
            </span>
          </div>
        </div>
        
        <Button 
          type={user.isFollowed ? "default" : "primary"}
          size="small"
          onClick={handleFollowClick}
          className="follow-button"
        >
          {user.isFollowed ? '已关注' : '关注'}
        </Button>
      </div>
    </Card>
  );
};

export default UserCard; 