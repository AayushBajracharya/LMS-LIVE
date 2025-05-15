import React, { useState } from 'react';
import LoginForm from '../components/login/LoginForm';
import SignUpModal from '../components/signup/SignUpModal';
import Gbook from '../assets/G-book.svg';
import img from '../assets/HSMSS Library.svg';

const LoginPage: React.FC = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <LoginForm />
      <div className="flex flex-col justify-center items-center w-1/2 bg-[#255d81] text-white rounded-l-3xl">
        <img src={Gbook} alt="Library Logo" className="mb-4" />
        <img src={img} alt="Library Logo" className="mb-4" />
        <p className="text-3xl font-medium mb-2">New to our platform?</p>
        <p className="text-3xl font-bold mb-4">Register Now</p>
        <button
          onClick={() => setIsSignUpOpen(true)}
          className="bg-[#d9d9d9] text-black py-3 px-24 rounded-full text-xl"
        >
          Register
        </button>
      </div>
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
    </div>
  );
};

export default LoginPage;