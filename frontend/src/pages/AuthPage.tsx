import { useParams } from 'react-router-dom';
import AuthForm from '../components/form/AuthForm';

export default function AuthPage() {
  const { mode } = useParams();

  return <AuthForm mode={mode === 'register' ? 'register' : 'login'} />;
}