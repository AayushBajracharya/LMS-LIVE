import React from 'react';
import { useDraggableModal } from '../../hooks/useDraggableModal';
import { useSignup } from '../../hooks/useSignup';
import { User } from '../../types/model';
import { useForm } from 'react-hook-form';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SignupFormInputs = Omit<User, 'userId'>;

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>();
  const { loading, error: apiError, success, handleSubmit: onSubmit } = useSignup(onClose);

  const { modalRef, headerRef, position, handleMouseDown } = useDraggableModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-100 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-md mx-4 absolute"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        <div
          ref={headerRef}
          onMouseDown={handleMouseDown}
          className="flex justify-between items-center p-4 border-b border-gray-200 cursor-move bg-gray-100"
        >
          <h5 className="text-lg font-semibold">Register Now</h5>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                {...register('username', { required: 'Username is required' })}
                placeholder="Enter your username"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
                })}
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="flex flex-wrap -mx-2 mb-3">
              <div className="w-full md:w-1/2 px-2 mb-3 md:mb-0">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  placeholder="••••••"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>
              <div className="w-full md:w-1/2 px-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  {...register('role', { required: 'Role is required' })}
                  placeholder="Role"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#255d81] text-white p-3 rounded-md hover:bg-[#13364c] transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

            {apiError && <p className="text-red-500 mt-2 text-center text-sm">{apiError}</p>}
            {success && <p className="text-green-500 mt-2 text-center text-sm">Signup successful!</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;