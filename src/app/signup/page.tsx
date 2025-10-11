import SignUpForm from '@/app/components/signupform';
import Image from 'next/image';

export default function SignUpPage() {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Kiri - Branding */}
      <div className="relative w-full md:w-1/2 h-full bg-gray-900 overflow-hidden">
        <Image
          src="/tech-bg.jpg" // Pastikan gambar ini ada di folder public
          alt="Design background"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-50"
        />
        
        {/* Elemen Geometris */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500 opacity-80 transform rotate-45"></div>
        
        {/* Konten Teks */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white p-8">
          <h1 className="text-5xl font-bold mb-4">PersonalAI Organizer</h1>
          <p className="text-lg max-w-md">
            Access to thousands of design resources and templates
          </p>
        </div>
      </div>

      {/* Kanan - Form Sign Up */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-gray-50">
        <SignUpForm />
      </div>
    </div>
  );
}