import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Button, message, Modal, Image } from 'antd';
import { 
  HeartOutlined, 
  HeartFilled, 
  MessageOutlined, 
  StarOutlined, 
  StarFilled,
  EllipsisOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { Note } from '../../api/note';
import { likeNote, unlikeNote, collectNote, uncollectNote } from '../../api/note';
import useUserStore from '../../stores/userStore';
import './style.scss';

interface NoteCardProps {
  note: Note;
  onLikeChange?: (id: string, liked: boolean) => void;
  onCollectChange?: (id: string, collected: boolean) => void;
}

// 笔记卡片组件
const NoteCard: React.FC<NoteCardProps> = ({ note, onLikeChange, onCollectChange }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();
  const [isLiked, setIsLiked] = useState(note.isLiked);
  const [isCollected, setIsCollected] = useState(note.isCollected);
  const [likeCount, setLikeCount] = useState(note.likeCount);
  const [collectCount, setCollectCount] = useState(note.collectCount);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 处理点赞/取消点赞
  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      message.warning('请先登录');
      return navigate('/login');
    }

    try {
      if (isLiked) {
        await unlikeNote(note.id);
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        onLikeChange?.(note.id, false);
      } else {
        await likeNote(note.id);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        onLikeChange?.(note.id, true);
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    }
  };

  // 处理收藏/取消收藏
  const handleCollectClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      message.warning('请先登录');
      return navigate('/login');
    }

    try {
      if (isCollected) {
        await uncollectNote(note.id);
        setIsCollected(false);
        setCollectCount(prev => prev - 1);
        onCollectChange?.(note.id, false);
      } else {
        await collectNote(note.id);
        setIsCollected(true);
        setCollectCount(prev => prev + 1);
        onCollectChange?.(note.id, true);
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    }
  };

  // 跳转到笔记详情页
  const goToDetail = () => {
    navigate(`/note/${note.id}`);
  };

  // 跳转到用户主页
  const goToUserProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${note.userId}`);
  };

  // 查看大图
  const handlePreview = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation();
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  // 渲染图片内容
  const renderImages = () => {
    if (!note.images || note.images.length === 0) {
      return null;
    }

    if (note.images.length === 1) {
      return (
        <div 
          className="note-single-image" 
          onClick={(e) => handlePreview(e, note.images[0])}
        >
          <img src={note.images[0]} alt="笔记图片" />
        </div>
      );
    }

    return (
      <div className="note-image-grid">
        {note.images.slice(0, 4).map((image, index) => (
          <div 
            key={index} 
            className="note-grid-item"
            onClick={(e) => handlePreview(e, image)}
          >
            <img src={image} alt={`笔记图片 ${index}`} />
            {index === 3 && note.images.length > 4 && (
              <div className="more-images">
                <span>+{note.images.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Card 
        className="note-card" 
        bodyStyle={{ padding: '12px' }}
        onClick={goToDetail}
      >
        {/* 图片区域 */}
        {renderImages()}
        
        {/* 内容区域 */}
        <div className="note-content">
          <h3 className="note-title">{note.title}</h3>
          <p className="note-text">{note.content.length > 100 
            ? `${note.content.slice(0, 100)}...` 
            : note.content}
          </p>
        </div>
        
        {/* 用户信息区域 */}
        <div className="note-user" onClick={goToUserProfile}>
          <Avatar src={note.avatar} size="small" />
          <span className="username">{note.username}</span>
        </div>
        
        {/* 标签区域 */}
        {note.tags && note.tags.length > 0 && (
          <div className="note-tags">
            {note.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}
        
        {/* 底部操作区 */}
        <div className="note-actions">
          <Button 
            type="text" 
            icon={isLiked ? <HeartFilled style={{ color: '#ff2442' }} /> : <HeartOutlined />}
            onClick={handleLikeClick}
          >
            {likeCount > 0 && likeCount}
          </Button>
          
          <Button 
            type="text" 
            icon={<MessageOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/note/${note.id}#comments`);
            }}
          >
            {note.commentCount > 0 && note.commentCount}
          </Button>
          
          <Button 
            type="text" 
            icon={isCollected ? <StarFilled style={{ color: '#ffba00' }} /> : <StarOutlined />}
            onClick={handleCollectClick}
          >
            {collectCount > 0 && collectCount}
          </Button>
          
          <Button 
            type="text" 
            icon={<ShareAltOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              message.success('链接已复制到剪贴板');
            }}
          />
        </div>
      </Card>

      {/* 图片预览 */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        className="image-preview-modal"
      >
        <img src={previewImage} alt="预览图片" style={{ width: '100%' }} />
      </Modal>
    </>
  );
};

export default NoteCard; 