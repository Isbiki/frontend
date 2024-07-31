import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import signin from '@/helpers/signin';
import setAuthToken from '@/helpers/setAuthToken';

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    saveSession
  } = useAuthContext();
  const [searchParams] = useSearchParams();
  const {
    showNotification
  } = useNotificationContext();
  const loginFormSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password')
  });
  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const redirectUser = () => {
    const redirectLink = searchParams.get('redirectTo');
    if (redirectLink) navigate(redirectLink); else navigate('/');
  };
  const login = handleSubmit(async values => {
    try {
      console.log(values);
      const res = await signin(values.email, values.password);
      if (res.data.success) {
        saveSession({
          ...(res.data.user ?? {}),
        });
        setAuthToken(true);
        localStorage.setItem('authToken', res.data.token);
        redirectUser();
        showNotification({
          message: 'Successfully logged in. Redirecting....',
          variant: 'success'
        });
      }
      else {
        showNotification({
          message: res.data.message,
          variant: 'danger'
        });
      }
    } catch (e) {
      if (e.response?.data?.error) {
        showNotification({
          message: e.response?.data?.error,
          variant: 'danger'
        });
      }
    } finally {
      setLoading(false);
    }
  });
  return {
    loading,
    login,
    control
  };
};
export default useSignIn;