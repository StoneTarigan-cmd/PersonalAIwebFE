'use client';

import { useState } from 'react'; // Hanya impor useState
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const SignUpForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Gunakan tipe string | undefined secara langsung
  const [phone, setPhone] = useState<string | undefined>();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || '', password }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong during sign up.');
      }

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Account created, but failed to log in. Please try logging in manually.');
      } else {
        router.push('/dashboard');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Sign up now</h2>
      </div>

      <form onSubmit={handleSignUp} className="space-y-5">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div>
  <input
    type="text"
    placeholder="Name" // <-- DIPERBARUI
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" // <-- TAMBAHKAN INI
  />
</div>

<div>
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" // <-- DAN INI
  />
</div>

<div>
  <PhoneInput
    international
    defaultCountry="US"
    value={phone}
    onChange={setPhone}
    placeholder="Your phone number" // <-- DIPERBARUI
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" // <-- DAN INI
    // ... style lainnya
  />
</div>

<div>
  <input
    type="password"
    placeholder="Password" // <-- DIPERBARUI
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" // <-- DAN INI
    // ... style lainnya
  />
</div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center">
        Already have an account? <Link href="/" className="font-medium text-indigo-600 hover:underline">Log in</Link>
      </p>

      <p className="text-xs text-gray-500 text-center">
        By signing up, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default SignUpForm;