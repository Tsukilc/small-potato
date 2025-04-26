import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Input, 
  Card, 
  Empty, 
  Skeleton, 
  Pagination, 
  Tabs,
  Tag
} from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  TagOutlined 
} from '@ant-design/icons';
import NoteCard from '../../components/NoteCard';
import UserCard from '../../components/UserCard';
import { getNoteList, Note } from '../../api/note';
import './style.scss';

const { TabPane } = Tabs;
const { Search: SearchInput } = Input;

// 搜索页面
const Search: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // 从URL获取搜索关键词
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keywordParam = params.get('keyword');
    if (keywordParam) {
      setKeyword(keywordParam);
      searchNotes(keywordParam);
    }
  }, [location.search]);

  // 搜索笔记
  const searchNotes = async (searchKeyword: string, page = 1) => {
    if (!searchKeyword.trim()) return;
    
    setLoading(true);
    try {
      const data = await getNoteList({
        keyword: searchKeyword,
        page,
        pageSize
      });
      setNotes(data.list);
      setTotal(data.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索提交
  const handleSearch = (value: string) => {
    if (value.trim()) {
      setKeyword(value);
      searchNotes(value);
      // 更新URL
      navigate(`/search?keyword=${encodeURIComponent(value.trim())}`);
    }
  };

  // 处理页码变化
  const handlePageChange = (page: number, size?: number) => {
    if (size && size !== pageSize) {
      setPageSize(size);
    }
    searchNotes(keyword, page);
  };

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    navigate(`/explore?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="search-page">
      {/* 搜索框 */}
      {/* <div className="search-header">
        <SearchInput
          placeholder="搜索笔记、用户、标签"
          allowClear
          enterButton="搜索"
          size="large"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onSearch={handleSearch}
          prefix={<SearchOutlined />}
        />
      </div> */}
      
      {/* 没有关键词情况 */}
      {!keyword && (
        <div className="empty-search">
          <Empty 
            description="请输入关键词搜索" 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        </div>
      )}
      
      {/* 有关键词但搜索中 */}
      {keyword && loading && (
        <Row gutter={[16, 16]}>
          {Array(4).fill(null).map((_, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card className="skeleton-card">
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {/* 有关键词且搜索完成 */}
      {keyword && !loading && (
        <div className="search-results">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="search-tabs"
          >
            {/* 笔记标签页 */}
            <TabPane 
              tab={<span><FileTextOutlined /> 笔记</span>} 
              key="notes"
            >
              {notes.length > 0 ? (
                <>
                  <Row gutter={[16, 16]}>
                    {notes.map(note => (
                      <Col xs={24} sm={12} md={8} lg={6} key={note.id}>
                        <NoteCard note={note} />
                      </Col>
                    ))}
                  </Row>
                  
                  {/* 分页 */}
                  {total > pageSize && (
                    <div className="pagination-container">
                      <Pagination 
                        current={currentPage}
                        total={total}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger
                      />
                    </div>
                  )}
                </>
              ) : (
                <Empty description={`未找到与"${keyword}"相关的笔记`} />
              )}
            </TabPane>
            
            {/* 用户标签页 */}
            <TabPane 
              tab={<span><UserOutlined /> 用户</span>} 
              key="users"
            >
              <Empty description="功能开发中..." />
            </TabPane>
            
            {/* 标签标签页 */}
            <TabPane 
              tab={<span><TagOutlined /> 标签</span>} 
              key="tags"
            >
              <Empty description="功能开发中..." />
            </TabPane>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Search; 