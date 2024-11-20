import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTER_USER, LOGIN_USER } from '../graphql/mutations';
import { useStore } from '../store';
const initialFormData = {
  username: '',
  email: '',
  password: '',
  errorMessage: ''
};
const AuthForm = ({ isLogin, handleModalClose }: { handleModalClose: () => void; isLogin: boolean; }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [showAlert, setShowAlert] = useState(false);
  const { setState } = useStore()!;
  const navigate = useNavigate();
  const [registerUser] = useMutation(REGISTER_USER);
  const [loginUser] = useMutation(LOGIN_USER);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const authFunction = isLogin ? loginUser : registerUser;
      const { errorMessage, ...variables } = formData;
      const { data } = await authFunction({
        variables: { ...variables }
      });
      setState((oldState) => ({
        ...oldState,
        user: data.user
      }));
      setFormData({ ...initialFormData });
      handleModalClose();
      navigate('/');
    } catch (err: any) {
      setFormData({
        ...formData,
        errorMessage: err.message
      });
      setShowAlert(true);
    }
  };
  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          {formData.errorMessage}
        </Alert>
        {!isLogin && (
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='username'>Username</Form.Label>
            <Form.Control
              type='text'
              placeholder='Your username'
              name='username'
              onChange={handleInputChange}
              value={formData.username || ''}
              required
            />
            <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
          </Form.Group>
        )}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={formData.email || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={formData.password || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(formData.email && formData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};
export default AuthForm;