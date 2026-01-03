'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyAccountPage() {
  const [email, setEmail] = useState('');
  const [tokenValues, setTokenValues] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  // --- TIMER EXPIRED TOKEN (10 Menit) ---
  const [timeLeft, setTimeLeft] = useState(600); 
  
  // --- STATE UNTUK VALIDASI ATTEMPT ---
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0); 
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Timer Token Expired (Berjalan selalu, tapi disembunyikan saat salah)
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // 2. Timer Lockout (Berjalan hanya jika isLocked true)
  useEffect(() => {
    let lockInterval: NodeJS.Timeout | null = null;

    if (isLocked && lockTimeLeft > 0) {
      lockInterval = setInterval(() => {
        setLockTimeLeft((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setWrongAttempts(0); // Reset attempt
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (lockInterval) clearInterval(lockInterval);
    };
  }, [isLocked, lockTimeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // --- HANDLE INPUTS ---
  const handleInputChange = (value: string, index: number) => {
    if (isLocked) return;

    const numericValue = value.replace(/\D/g, '');
    const newTokenValues = [...tokenValues];
    newTokenValues[index] = numericValue;
    setTokenValues(newTokenValues);

    if (numericValue && index < 5) {
        const nextInput = document.getElementById(`token-input-${index + 1}`) as HTMLInputElement;
        if (nextInput) {
            nextInput.focus();
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !tokenValues[index] && index > 0) {
        const prevInput = document.getElementById(`token-input-${index - 1}`) as HTMLInputElement;
        if (prevInput) {
            prevInput.focus();
        }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
    const newTokenValues = pastedData.split('');
    setTokenValues([...newTokenValues, ...Array(6 - newTokenValues.length).fill('')]);
  };
  
  // --- HANDLE VERIFY ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isLocked) {
        setMessage('Please wait for the cooldown period to end.');
        return;
    }

    const token = tokenValues.join('');
    
    if (token.length !== 6) {
      setMessage('Please enter the complete 6-digit code.');
      return;
    }

    if (timeLeft === 0) {
        setMessage('This verification code has expired. Please request a new code.');
        return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setMessage(data.message);
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error: any) {
      const errorMsg = error.message || 'Verification failed';
      setMessage(errorMsg);

      const newAttemptCount = wrongAttempts + 1;
      setWrongAttempts(newAttemptCount);

      if (newAttemptCount === 3) {
          setIsLocked(true);
          setLockTimeLeft(5 * 60); 
          setMessage('Too many attempts. Please wait 5 minutes.');
      } else if (newAttemptCount === 4) {
          setIsLocked(true);
          setLockTimeLeft(10 * 60); 
          setMessage('Too many attempts. Please wait 10 minutes.');
      }

    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLE RESEND ---
  const handleResend = async () => {
    setIsResending(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      setMessage(data.message || 'New code sent!');
      setTokenValues(['', '', '', '', '', '']);
      setTimeLeft(600); // Reset token timer
      setWrongAttempts(0); // Reset wrongAttempts -> Timer akan muncul lagi
      setIsLocked(false);
      setLockTimeLeft(0);

    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center justify-center bg-linear-to-r from-indigo-500 to-cyan-500 p-6 text-white">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h1 className="text-2xl font-bold">PersonalAI Organizer</h1>
            <p className="mt-2 text-center text-sm text-indigo-100">
                Enter the verification code we sent to your email.
            </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
            {/* Email Display */}
            <div className="mb-6 rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-sm font-medium text-gray-800">{email || 'No email provided'}</p>
            </div>

            {/* Inputs */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <label htmlFor="token-input-0" className="block text-sm font-medium text-gray-700">
                        Verification Code
                    </label>
                    
                    {/* TIMER DISPLAY (HANYA MUNCUL JIKA TIDAK ADA KESALAHAN / wrongAttempts === 0) */}
                    {wrongAttempts === 0 && (
                        <div className={`text-sm font-semibold ${timeLeft === 0 ? 'text-red-600' : (timeLeft < 60 ? 'text-red-500' : 'text-indigo-600')}`}>
                            {timeLeft === 0 ? 'Expired' : formatTime(timeLeft)}
                        </div>
                    )}
                </div>
                
                {/* Wording Info */}
                <p className="text-xs text-gray-500 mb-4">
                    Please enter the code before it expires in 10 minutes.
                </p>
                <div className="flex justify-between space-x-2">
                    {tokenValues.map((value, index) => (
                        <input
                            key={index}
                            id={`token-input-${index}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={value}
                            onChange={(e) => handleInputChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            disabled={timeLeft === 0 || isLocked}
                            className={`h-12 w-12 rounded-lg border text-center text-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
                                timeLeft === 0 || isLocked
                                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 focus:border-indigo-500'
                            }`}
                            required
                        />
                    ))}
                </div>
            </div>

            {/* Verify Button */}
            <button
                type="submit"
                disabled={isLoading || isResending || timeLeft === 0 || isLocked}
                className="w-full rounded-lg bg-linear-to-r from-indigo-500 to-cyan-500 py-3 font-semibold text-white transition-all duration-200 hover:from-indigo-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
                {isLoading ? 'Verifying...' : 'Verify Account'}
            </button>

            {/* Resend Button */}
            <div className="text-center">
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || isLoading || isLocked}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed underline"
                >
                    {isResending ? 'Sending new code...' : "Didn't receive code? Resend"}
                </button>
                {isLocked && (
                    <p className="text-xs text-gray-400 mt-1 no-underline">
                        (Too many invalid token attempts. Resend available after {formatTime(lockTimeLeft)})
                    </p>
                )}
            </div>

            {/* Message */}
            {message && !isLocked && (
                <p className={`mt-4 text-center text-sm ${message.includes('successfully') || message.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </form>
      </div>
    </div>
  );
}