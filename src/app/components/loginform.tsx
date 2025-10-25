'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from "react-icons/fc";
// import { FaTwitter } from "react-icons/fa";
import SocialButton from './socialbutton';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login process started...'); // DEBUG 1
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    console.log('SignIn result:', result); // DEBUG 2

    if (result?.error) {
      console.log('Login failed, setting error.'); // DEBUG 3
      setError('Email atau password tidak valid');
    } else {
      console.log('Login successful, redirecting.'); // DEBUG 4
      window.location.href = '/Dashboard';
    }
    console.log('Process finished, setting loading to false.'); // DEBUG 5
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
      </div>
      
      <div className="space-y-4">
        <SocialButton
          icon={<FcGoogle size={20} />}
          text="Continue with Google"
          onClick={() => signIn('google')}
        />
        {/* <SocialButton
          icon={<FaTwitter size={20} className="text-sky-500" />}
          text="Continue with Twitter"
          onClick={() => signIn('twitter')}
        /> */}
      </div>

      <div className="relative flex items-center justify-center w-full">
        <div className="w-full border-t border-gray-300"></div>
        <span className="absolute px-3 text-sm text-gray-500 bg-white">OR</span>
      </div>

      <form onSubmit={handleCredentialsSignIn} className="space-y-5">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div>
          <input
            type="email"
            placeholder="Email" // <-- TEKS DIPERBARUI
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" // <-- TAMBAHKAN INI
          />
        </div>
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password" // <-- TEKS DIPERBARUI
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" // <-- DAN INI
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center">
        Don't have an account? <a href="/signup" className="font-medium text-indigo-600 hover:underline">Sign up</a>
      </p>
    </div>
  );
};

export default LoginForm;