'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const SignUpForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<string | undefined>();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // --- FUNGSI CEK KEKUATAN PASSWORD (DIPERBAIKI) ---
  const passwordStrength = useMemo(() => {
    let score = 0;
    
    if (!password) return { score: 0, text: '', colorClass: 'bg-gray-200' }; // Default aman

    // 1. Panjang minimal 6 karakter
    if (password.length >= 6) score++;
    // 2. Panjang minimal 8 karakter
    if (password.length >= 8) score++;
    // 3. Mengandung Angka
    if (/[0-9]/.test(password)) score++;
    // 4. Mengandung Karakter Simbol
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let text = '';
    let colorClass = 'bg-red-500'; // Default fallback

    if (score <= 1) {
      text = 'Weak';
      colorClass = 'bg-red-500';
    } else if (score === 2) {
      text = 'Fair';
      colorClass = 'bg-orange-500';
    } else if (score === 3) {
      text = 'Good';
      colorClass = 'bg-yellow-500';
    } else if (score === 4) {
      text = 'Strong';
      colorClass = 'bg-green-500';
    }

    return { score, text, colorClass };
  }, [password]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || '', password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong during sign up.');
      }

      alert('Account created! Please check your email for the verification code.');
      router.push(`/verify-account?email=${encodeURIComponent(email)}`);

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
        {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
        
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>

        <div>
          <PhoneInput
            international
            defaultCountry="US"
            value={phone}
            onChange={setPhone}
            placeholder="Your phone number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
          
          {/* --- PASSWORD STRENGTH METER --- */}
          {password && (
            <div className="mt-2">
              <div className="flex gap-1 h-1.5 w-full">
                {[1, 2, 3, 4].map((segment) => (
                  <div
                    key={segment}
                    className={`h-full flex-1 rounded-sm transition-all duration-300 ${
                      passwordStrength.score >= segment ? passwordStrength.colorClass : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              {/* PERBAIKAN: Menggunakan map warna manual untuk teks agar tidak error replace */}
              <p className="text-xs text-right mt-1 text-gray-500">
                Password Strength:{' '}
                <span 
                  className={`font-semibold ${
                    passwordStrength.score === 4 ? 'text-green-500' : 
                    passwordStrength.score === 3 ? 'text-yellow-500' : 
                    passwordStrength.score === 2 ? 'text-orange-500' : 
                    'text-red-500'
                  }`}
                >
                  {passwordStrength.text}
                </span>
              </p>
            </div>
          )}
          {/* -------------------------------- */}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
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