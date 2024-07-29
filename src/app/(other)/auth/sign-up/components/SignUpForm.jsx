import PasswordFormInput from '@/components/form/PasswordFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormCheck } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import httpClient from '@/helpers/httpClient';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const signUpSchema = yup.object({
    name: yup.string().required('please enter your name'),
    email: yup.string().email('Please enter a valid email').required('please enter your email'),
    password: yup.string().required('Please enter your password')
  });
  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(signUpSchema)
  });
  const navigate = useNavigate();
  const onSubmit = async (values) => {
    try {
      const res = await httpClient.post('/signup', values);
      if (res.data.success) {
        saveSession({
          ...(res.data.user ?? {}),
          token: res.data.token
        });
        navigate('/sign-in');
        showNotification({
          message: 'Successfully signed up. Redirecting....',
          variant: 'success'
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e) {
      if (e.response?.data?.error) {
        showNotification({
          message: e.response?.data?.error,
          variant: 'danger'
        });
      }
    } finally {
      
    }
  };
  return <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
      <TextFormInput control={control} name="name" containerClassName="mb-3" label="Name" id="name" placeholder="Enter your name" />
      <TextFormInput control={control} name="email" containerClassName="mb-3" label="Email" id="email-id" placeholder="Enter your email" />
      <PasswordFormInput control={control} name="password" containerClassName="mb-3" placeholder="Enter your password" id="password-id" label="password" />
      <div className="mb-3">
        <FormCheck label="I accept Terms and Condition" id="termAndCondition" />
      </div>
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </div>
    </form>;
};
export default SignUpForm;