// src/app/verify-account/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyAccountPage() {
  const [token, setToken] = useState<string[]>(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State baru untuk mengontrol loading overlay
  const [isVerifyingSuccess, setIsVerifyingSuccess] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const sanitizedValue = value.slice(-1);
    const newToken = [...token];
    newToken[index] = sanitizedValue;
    setToken(newToken);

    if (sanitizedValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!token[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.every(char => /\d/.test(char))) {
      const newToken = [...token];
      pastedData.forEach((char, index) => {
        if (index < 6) {
          newToken[index] = char;
        }
      });
      setToken(newToken);
      const lastFilledIndex = newToken.lastIndexOf('');
      inputRefs.current[lastFilledIndex > 0 ? lastFilledIndex : 5]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullToken = token.join('');
    
    if (fullToken.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: fullToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed.');
      }

      setSuccess(data.message);
      // Tampilkan loading overlay
      setIsVerifyingSuccess(true);

      // Tunggu 2 detik sebelum mengalihkan
      setTimeout(() => {
        router.push('/?message=AccountVerified');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      // Jangan matikan isLoading utama agar tombol tetap disabled
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Loading Overlay Transparan */}
      {isVerifyingSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="text-center">
            {/* Spinner Elegan */}
            <div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold text-white">Verification Successful!</p>
            <p className="text-sm text-gray-300">Redirecting you to the login page...</p>
          </div>
        </div>
      )}

      {/* Konten Utama */}
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Verify Your Account</h2>
            <p className="mt-2 text-gray-600">
              We've sent a code to <strong>{email}</strong>
            </p>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center bg-green-50 p-3 rounded">{success}</p>}

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-between space-x-2">
              {token.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || token.join('').length !== 6}
              className="w-full py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}