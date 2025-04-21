import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Upload, 
  Card, 
  Tag, 
  Space, 
  Modal,
  Tooltip,
  Divider
} from 'antd';
import { 
  PictureOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  TagOutlined,
  SmileOutlined
} from '@ant-design/icons';
import type { RcFile, UploadProps, UploadFile } from 'antd/es/upload';
import { createNote, uploadNoteImage } from '../../api/note';
import useUserStore from '../../stores/userStore';
import './style.scss';

const { TextArea } = Input;

// 笔记预览组件
interface PreviewProps {
  visible: boolean;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  onClose: () => void;
}

const NotePreview: React.FC<PreviewProps> = ({ 
  visible, 
  title, 
  content, 
  images, 
  tags, 
  onClose 
}) => {
  return (
    <Modal
      title="笔记预览"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>关闭预览</Button>
      ]}
      width={700}
    >
      <div className="note-preview">
        <h2 className="preview-title">{title || '无标题'}</h2>
        
        {images.length > 0 && (
          <div className="preview-images">
            {images.map((img, index) => (
              <div key={index} className="preview-image-item">
                <img src={img} alt={`图片 ${index}`} />
              </div>
            ))}
          </div>
        )}
        
        <div className="preview-content">
          {content || '暂无内容'}
        </div>
        
        {tags.length > 0 && (
          <div className="preview-tags">
            {tags.map((tag, index) => (
              <Tag key={index} color="pink">#{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

// 发布笔记页面组件
const PublishNote: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inputTagVisible, setInputTagVisible] = useState(false);
  const [tagInputValue, setTagInputValue] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  // 检查登录状态
  useEffect(() => {
    if (!isLoggedIn) {
      message.warning('请先登录再发布笔记');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // 处理图片上传前校验
  const beforeUpload = (file: RcFile) => {
    // 验证文件类型
    const isImage = /image\/(jpeg|png|jpg|gif|webp)/.test(file.type);
    if (!isImage) {
      message.error('只能上传图片文件!');
      return Upload.LIST_IGNORE;
    }
    
    // 验证文件大小
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过5MB!');
      return Upload.LIST_IGNORE;
    }
    
    return true;
  };

  // 自定义上传图片
  const customUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    
    try {
      const result = await uploadNoteImage(file);
      onSuccess(result, file);
      
      // 添加到已上传图片列表
      setUploadedImages(prev => [...prev, result.url]);
    } catch (error) {
      onError(error);
      message.error('图片上传失败，请重试');
    }
  };

  // 处理图片列表变化
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 处理图片移除
  const handleRemove = (file: UploadFile) => {
    const index = fileList.indexOf(file);
    if (index !== -1 && file.status === 'done' && file.response) {
      // 从已上传列表中移除
      const newUploadedImages = [...uploadedImages];
      newUploadedImages.splice(index, 1);
      setUploadedImages(newUploadedImages);
    }
    return true;
  };

  // 处理标签输入显示
  const showTagInput = () => {
    setInputTagVisible(true);
  };

  // 处理标签输入关闭
  const handleTagInputConfirm = () => {
    if (tagInputValue && !tags.includes(tagInputValue)) {
      setTags([...tags, tagInputValue]);
    }
    setInputTagVisible(false);
    setTagInputValue('');
  };

  // 移除标签
  const handleTagClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  // 预览笔记
  const handlePreview = () => {
    setPreviewVisible(true);
  };

  // 提交笔记
  const handleSubmit = async (values: any) => {
    if (uploadedImages.length === 0) {
      return message.warning('请至少上传一张图片');
    }

    setLoading(true);
    try {
      await createNote({
        title: values.title,
        content: values.content,
        images: uploadedImages,
        tags
      });
      
      message.success('笔记发布成功');
      navigate('/');
    } catch (error) {
      message.error('发布失败，请重试');
      console.error('发布笔记失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publish-page">
      <Card className="publish-card">
        <h1 className="page-title">发布笔记</h1>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          {/* 标题输入 */}
          <Form.Item
            name="title"
            label="标题"
            rules={[
              { required: true, message: '请输入笔记标题' },
              { max: 50, message: '标题最多50个字符' }
            ]}
          >
            <Input placeholder="请输入标题" maxLength={50} showCount />
          </Form.Item>
          
          {/* 图片上传 */}
          <Form.Item 
            label="图片" 
            extra="最多上传9张图片，每张不超过5MB，支持 JPG/PNG/GIF 格式"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              customRequest={customUpload}
              onChange={handleChange}
              onRemove={handleRemove}
              maxCount={9}
              multiple
            >
              {fileList.length >= 9 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          
          {/* 内容输入 */}
          <Form.Item
            name="content"
            label="内容"
            rules={[
              { required: true, message: '请输入笔记内容' },
              { min: 10, message: '内容至少10个字符' }
            ]}
          >
            <TextArea 
              placeholder="分享你的想法和经历..." 
              autoSize={{ minRows: 6, maxRows: 12 }}
              maxLength={2000}
              showCount
            />
          </Form.Item>
          
          {/* 标签输入 */}
          <Form.Item label="标签">
            <div className="tags-container">
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleTagClose(tag)}
                  color="pink"
                >
                  #{tag}
                </Tag>
              ))}
              
              {inputTagVisible ? (
                <Input
                  type="text"
                  size="small"
                  className="tag-input"
                  value={tagInputValue}
                  onChange={e => setTagInputValue(e.target.value)}
                  onBlur={handleTagInputConfirm}
                  onPressEnter={handleTagInputConfirm}
                  autoFocus
                  maxLength={20}
                />
              ) : (
                <Tag 
                  className="add-tag-button" 
                  onClick={showTagInput}
                  style={{ borderStyle: 'dashed' }}
                >
                  <PlusOutlined /> 添加标签
                </Tag>
              )}
            </div>
            <div className="tags-hint">最多添加5个标签，每个标签不超过20个字符</div>
          </Form.Item>
          
          <Divider />
          
          {/* 操作按钮 */}
          <Form.Item>
            <div className="form-actions">
              <Space size="middle">
                <Button 
                  icon={<EyeOutlined />} 
                  onClick={handlePreview}
                >
                  预览笔记
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlusOutlined />}
                >
                  发布笔记
                </Button>
              </Space>
            </div>
          </Form.Item>
        </Form>
      </Card>
      
      {/* 笔记预览 */}
      <NotePreview
        visible={previewVisible}
        title={form.getFieldValue('title') || ''}
        content={form.getFieldValue('content') || ''}
        images={uploadedImages}
        tags={tags}
        onClose={() => setPreviewVisible(false)}
      />
    </div>
  );
};

export default PublishNote; 