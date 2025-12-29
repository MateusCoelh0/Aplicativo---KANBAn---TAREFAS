import { useSearchParams } from 'react-router-dom';
import ForgotPassword from '../Components/auth/ForgotPassword';

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return <ForgotPassword />;
}
