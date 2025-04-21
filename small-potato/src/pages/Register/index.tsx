import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  message, 
  Checkbox 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import useUserStore from '../../stores/userStore';
import './style.scss';

// 注册页面组件
const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { register, isLoggedIn, loading } = useUserStore();

  // 如果已登录，跳转到首页
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      await register(values.username, values.password, values.nickname);
      message.success('注册成功');
      navigate('/');
    } catch (error: any) {
      message.error(error.message || '注册失败，请稍后重试');
    }
  };

  return (
    <div className="register-page">
      <Card className="register-card">
        <div className="logo-container">
          <img src="/logo.png" alt="小红书" className="logo" />
          <h1 className="title">创建新账号</h1>
        </div>
        
        <Form
          form={form}
          name="register"
          className="register-form"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="nickname"
            rules={[
              { required: true, message: '请输入昵称' },
              { min: 2, message: '昵称至少2个字符' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="昵称" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { 
                validator: (_, value) => 
                  value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议和隐私政策')) 
              },
            ]}
          >
            <Checkbox>
              我已阅读并同意 <Link to="/terms">用户协议</Link> 和 <Link to="/privacy">隐私政策</Link>
            </Checkbox>
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-button"
              loading={loading}
              icon={<UserAddOutlined />}
              size="large"
              block
            >
              注册
            </Button>
          </Form.Item>
          
          <div className="login-link">
            已有账号? <Link to="/login">立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 