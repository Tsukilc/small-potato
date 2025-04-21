import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Checkbox, 
  Card, 
  message 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  LoginOutlined 
} from '@ant-design/icons';
import useUserStore from '../../stores/userStore';
import './style.scss';

// 登录页面组件
const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, isLoggedIn, loading } = useUserStore();
  const [remember, setRemember] = useState(true);

  // 如果已登录，跳转到首页
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      await login(values.username, values.password);
      message.success('登录成功');
      
      // 记住用户名
      if (remember) {
        localStorage.setItem('rememberedUsername', values.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      
      navigate('/');
    } catch (error: any) {
      message.error(error.message || '登录失败，请检查用户名和密码');
    }
  };

  // 从本地存储获取记住的用户名
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      form.setFieldsValue({ username: rememberedUsername });
    }
  }, [form]);

  return (
    <div className="login-page">
      <Card className="login-card">
        <div className="logo-container">
          <img src="/logo.png" alt="小红书" className="logo" />
          <h1 className="title">小红书</h1>
        </div>
        
        <Form
          form={form}
          name="login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
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
          
          <Form.Item>
            <div className="form-actions">
              <Checkbox
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              >
                记住我
              </Checkbox>
              <Link to="/forgot-password" className="forgot-link">
                忘记密码?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              loading={loading}
              icon={<LoginOutlined />}
              size="large"
              block
            >
              登录
            </Button>
          </Form.Item>
          
          <div className="register-link">
            还没有账号? <Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 