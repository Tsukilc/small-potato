import React, { useState, useEffect } from 'react';
import { Row, Col, Tabs, Skeleton, Empty, Pagination, Spin } from 'antd';
import { FireOutlined, RiseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import NoteCard from '../../components/NoteCard';
import { getNoteList, Note } from '../../api/note';
import './style.scss';

const { TabPane } = Tabs;

// 首页组件
const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [activeTab, setActiveTab] = useState('recommend');

  // 获取笔记列表
  const fetchNotes = async (page = 1, tab = 'recommend') => {
    setLoading(true);
    try {
      const data = await getNoteList({
        page,
        pageSize,
        tag: tab === 'recommend' ? undefined : tab
      });
      setNotes(data.list);
      setTotal(data.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('获取笔记列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化和切换标签时加载数据
  useEffect(() => {
    fetchNotes(1, activeTab);
  }, [activeTab]);

  // 处理页码变化
  const handlePageChange = (page: number, size?: number) => {
    if (size && size !== pageSize) {
      setPageSize(size);
    }
    fetchNotes(page, activeTab);
  };

  // 处理标签切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // 处理点赞变化
  const handleLikeChange = (id: string, liked: boolean) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { 
              ...note, 
              isLiked: liked, 
              likeCount: liked 
                ? note.likeCount + 1 
                : note.likeCount - 1
            } 
          : note
      )
    );
  };

  // 处理收藏变化
  const handleCollectChange = (id: string, collected: boolean) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { 
              ...note, 
              isCollected: collected, 
              collectCount: collected 
                ? note.collectCount + 1 
                : note.collectCount - 1
            } 
          : note
      )
    );
  };

  return (
    <div className="home-page">
      {/* 页面标题 */}
      <h1 className="page-title">探索精彩内容</h1>

      {/* 分类标签页 */}
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        className="category-tabs"
      >
        <TabPane 
          tab={<span><FireOutlined />推荐</span>} 
          key="recommend"
        />
        <TabPane 
          tab={<span><RiseOutlined />热门</span>} 
          key="hot"
        />
        <TabPane 
          tab={<span><ClockCircleOutlined />最新</span>} 
          key="latest"
        />
        {/* 可以根据需要添加更多标签 */}
      </Tabs>

      {/* 笔记列表 */}
      <div className="notes-container">
        {loading ? (
          // 加载中状态
          <Row gutter={[16, 16]}>
            {Array(8).fill(null).map((_, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <div className="note-card-skeleton">
                  <Skeleton.Image className="note-image-skeleton" />
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              </Col>
            ))}
          </Row>
        ) : notes.length > 0 ? (
          // 有数据状态
          <Row gutter={[16, 16]}>
            {notes.map(note => (
              <Col xs={24} sm={12} md={8} lg={6} key={note.id}>
                <NoteCard 
                  note={note} 
                  onLikeChange={handleLikeChange}
                  onCollectChange={handleCollectChange}
                />
              </Col>
            ))}
          </Row>
        ) : (
          // 无数据状态
          <Empty 
            description="暂无内容" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="empty-container"
          />
        )}
      </div>

      {/* 分页 */}
      {!loading && notes.length > 0 && (
        <div className="pagination-container">
          <Pagination 
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
          />
        </div>
      )}
    </div>
  );
};

export default Home; 