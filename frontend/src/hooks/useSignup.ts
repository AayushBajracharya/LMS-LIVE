import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { User } from '../types/model';
import { signupAsync } from '../store/slices/authSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

interface SignupData extends Omit<User, 'userId'> {}

export function useSignup(onClose: () => void) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit: SubmitHandler<SignupData> = async (data) => {
    try {
      await dispatch(signupAsync({ ...data, userId: 0 })).unwrap();
      setSuccess(true);
      onClose();
    } catch (err) {
      // Error is handled in the slice
    }
  };

  return {
    loading,
    error,
    success,
    handleSubmit,
  };
}