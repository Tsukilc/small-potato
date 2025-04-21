import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Avatar, 
  Button, 
  Skeleton, 
  Tag, 
  message, 
  Divider,
  Image,
  Form,
  Input,
  List
} from 'antd';
import { 
  HeartOutlined, 
  HeartFilled, 
  MessageOutlined, 
  StarOutlined, 
  StarFilled,
  ShareAltOutlined,
  UserOutlined,
  DeleteOutlined,
  SendOutlined
} from '@ant-design/icons';
import { getNoteDetail, likeNote, unlikeNote, collectNote, uncollectNote, Note, getNoteComments, addComment } from '../../api/note';
import { followUser, unfollowUser } from '../../api/user';
import useUserStore from '../../stores/userStore';
import './style.scss';

const { TextArea } = Input;

// 笔记详情页面组件
const NoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo, isLoggedIn } = useUserStore();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [collectCount, setCollectCount] = useState(0);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 获取笔记详情
  const fetchNoteDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await getNoteDetail(id);
      setNote(data);
      setIsLiked(data.isLiked);
      setIsCollected(data.isCollected);
      setIsFollowed(data.isFollowed ?? false);
      setLikeCount(data.likeCount);
      setCollectCount(data.collectCount);
      
      // 加载评论
      fetchComments();
    } catch (error) {
      message.error('获取笔记详情失败');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // 获取评论列表
  const fetchComments = async () => {
    if (!id) return;
    
    try {
      const response = await getNoteComments(id, {
        page: 1,
        pageSize: 20
      });
      setComments(response.list || []);
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  };

  // 初始化加载笔记详情
  useEffect(() => {
    fetchNoteDetail();
  }, [id]);

  // 处理点赞/取消点赞
  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      message.warning('请先登录');
      return navigate('/login');
    }

    try {
      if (isLiked) {
        await unlikeNote(id!);
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        await likeNote(id!);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    }
  };

  // 处理收藏/取消收藏
  const handleCollectClick = async () => {
    if (!isLoggedIn) {
      message.warning('请先登录');
      return navigate('/login');
    }

    try {
      if (isCollected) {
        await uncollectNote(id!);
        setIsCollected(false);
        setCollectCount(prev => prev - 1);
      } else {
        await collectNote(id!);
        setIsCollected(true);
        setCollectCount(prev => prev + 1);
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    }
  };

  // 处理关注/取消关注
  const handleFollowClick = async () => {
    if (!isLoggedIn) {
      message.warning('请先登录');
      return navigate('/login');
    }

    if (!note) return;

    try {
      if (isFollowed) {
        await unfollowUser(note.userId);
        setIsFollowed(false);
      } else {
        await followUser(note.userId);
        setIsFollowed(true);
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    }
  };

  // 处理评论提交
  const handleCommentSubmit = async () => {
    if (!isLoggedIn) {
      message.warning('请先登录');
      return navigate('/login');
    }

    if (!commentContent.trim()) {
      return message.warning('评论内容不能为空');
    }

    setCommentLoading(true);
    try {
      await addComment(id!, commentContent);
      message.success('评论成功');
      setCommentContent('');
      // 重新加载评论
      fetchComments();
    } catch (error) {
      message.error('评论失败，请稍后重试');
    } finally {
      setCommentLoading(false);
    }
  };

  // 处理图片预览
  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  // 分享笔记
  const handleShare = () => {
    // 复制当前URL到剪贴板
    navigator.clipboard.writeText(window.location.href);
    message.success('链接已复制到剪贴板');
  };

  // 渲染加载状态
  if (loading) {
    return (
      <div className="note-detail-page">
        <Card className="note-detail-card">
          <Skeleton avatar active paragraph={{ rows: 1 }} className="user-skeleton" />
          <Skeleton.Image className="cover-skeleton" />
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      </div>
    );
  }

  // 笔记不存在
  if (!note) {
    return (
      <div className="note-detail-page">
        <Card className="note-detail-card">
          <div className="note-not-found">
            <h2>笔记不存在或已被删除</h2>
            <Button type="primary" onClick={() => navigate('/')}>返回首页</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="note-detail-page">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {/* 笔记主卡片 */}
          <Card className="note-detail-card">
            {/* 用户信息 */}
            <div className="note-author">
              <div className="author-info">
                <Avatar 
                  src={note.avatar} 
                  size={40}
                  icon={<UserOutlined />}
                  onClick={() => navigate(`/user/${note.userId}`)}
                  className="author-avatar"
                />
                <div className="author-name-container">
                  <div 
                    className="author-name"
                    onClick={() => navigate(`/user/${note.userId}`)}
                  >
                    {note.username}
                  </div>
                  <div className="publish-time">
                    {new Date(note.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              
              {userInfo?.id !== note.userId && (
                <Button
                  type={isFollowed ? "default" : "primary"}
                  size="small"
                  onClick={handleFollowClick}
                >
                  {isFollowed ? '已关注' : '关注'}
                </Button>
              )}
            </div>
            
            {/* 笔记标题 */}
            <h1 className="note-title">{note.title}</h1>
            
            {/* 图片展示 */}
            {note.images && note.images.length > 0 && (
              <div className="note-images">
                <Image.PreviewGroup>
                  {note.images.map((image, index) => (
                    <div 
                      key={index} 
                      className="note-image-item"
                      onClick={() => handlePreview(image)}
                    >
                      <Image 
                        src={image} 
                        alt={`图片 ${index}`}
                        preview={false}
                      />
                    </div>
                  ))}
                </Image.PreviewGroup>
              </div>
            )}
            
            {/* 笔记内容 */}
            <div className="note-content">
              {note.content}
            </div>
            
            {/* 标签区域 */}
            {note.tags && note.tags.length > 0 && (
              <div className="note-tags">
                {note.tags.map((tag, index) => (
                  <Tag 
                    key={index} 
                    color="pink" 
                    onClick={() => navigate(`/explore?tag=${tag}`)}
                  >
                    #{tag}
                  </Tag>
                ))}
              </div>
            )}
            
            {/* 底部操作栏 */}
            <div className="note-actions">
              <Button 
                type="text" 
                icon={isLiked ? <HeartFilled style={{ color: '#ff2442' }} /> : <HeartOutlined />}
                onClick={handleLikeClick}
                className="action-button"
              >
                {likeCount > 0 && `${likeCount} `}点赞
              </Button>
              
              <Button 
                type="text" 
                icon={<MessageOutlined />}
                className="action-button"
                onClick={() => document.getElementById('comment-editor')?.focus()}
              >
                {note.commentCount > 0 && `${note.commentCount} `}评论
              </Button>
              
              <Button 
                type="text" 
                icon={isCollected ? <StarFilled style={{ color: '#ffba00' }} /> : <StarOutlined />}
                onClick={handleCollectClick}
                className="action-button"
              >
                {collectCount > 0 && `${collectCount} `}收藏
              </Button>
              
              <Button 
                type="text" 
                icon={<ShareAltOutlined />}
                onClick={handleShare}
                className="action-button"
              >
                分享
              </Button>
            </div>
          </Card>
          
          {/* 评论区域 */}
          <Card className="comments-card">
            <h3 className="comments-title">评论 ({note.commentCount})</h3>
            
            {/* 评论输入框 */}
            <div className="comment-editor">
              <Avatar 
                src={userInfo?.avatar} 
                icon={<UserOutlined />}
                size="large"
              />
              <div className="comment-input">
                <TextArea 
                  id="comment-editor"
                  placeholder={isLoggedIn ? "写下你的评论..." : "登录后发表评论"}
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  disabled={!isLoggedIn}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
                <Button 
                  type="primary" 
                  icon={<SendOutlined />} 
                  onClick={handleCommentSubmit}
                  loading={commentLoading}
                  disabled={!isLoggedIn || commentContent.trim() === ''}
                >
                  发布
                </Button>
              </div>
            </div>
            
            <Divider />
            
            {/* 评论列表 */}
            {comments.length > 0 ? (
              <List
                className="comment-list"
                itemLayout="horizontal"
                dataSource={comments}
                renderItem={comment => (
                  <List.Item
                    actions={[
                      <span key="reply">回复</span>,
                      userInfo?.id === comment.userId && (
                        <span key="delete" className="delete-comment">
                          <DeleteOutlined /> 删除
                        </span>
                      )
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={comment.avatar} icon={<UserOutlined />} />}
                      title={<Link to={`/user/${comment.userId}`}>{comment.username}</Link>}
                      description={
                        <>
                          <p>{comment.content}</p>
                          <span>{new Date(comment.createdAt).toLocaleString()}</span>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="no-comments">
                暂无评论，快来发表第一条评论吧！
              </div>
            )}
          </Card>
        </Col>
        
        {/* 右侧推荐区域 */}
        <Col xs={24} lg={8}>
          <Card className="related-card">
            <h3 className="card-title">相关推荐</h3>
            <p className="empty-tip">暂无相关推荐</p>
          </Card>
          
          <Card className="author-card">
            <h3 className="card-title">作者其他笔记</h3>
            <p className="empty-tip">暂无其他笔记</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NoteDetail; 