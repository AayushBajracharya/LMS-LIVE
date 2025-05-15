import { useNavigate } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';
import { LoginDTO } from '../types/model';
import { loginAsync } from '../store/slices/authSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

export function useLogin() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<LoginDTO> = async (data) => {
    try {
      await dispatch(loginAsync(data)).unwrap();
      navigate('/dashboard', { state: { showLoginToast: true }, replace: true });
      window.history.pushState(null, '', '/dashboard');
    } catch (err) {
      // Error is handled in the slice
    }
  };

  return {
    loading,
    error,
    handleSubmit,
  };
}