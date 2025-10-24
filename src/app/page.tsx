import LoginForm from '../app/components/loginform'; // Menggunakan jalur absolut yang lebih aman
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Kiri - Branding */}
      <div className="relative w-full md:w-1/2 h-full bg-gray-900 overflow-hidden">
        {/* 
          PENTING: 
          1. Pastikan Anda punya file gambar (misalnya 'tech-bg.jpg') di dalam folder `public/`.
          2. Jika nama filenya beda, ganti 'tech-bg.jpg' di bawah ini.
        */}
        <Image
          src="/tech-bg.jpg" 
          alt="Design background"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-50"
        />
        
        {/* Elemen Kotak Merah */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500 opacity-80 transform rotate-45"></div>
        
        {/* Konten Teks */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white p-8">
          <h1 className="text-5xl font-bold mb-4">PersonalAI Organizer</h1>
          <p className="text-lg max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      {/* Kanan - Form Login */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-gray-50">
        <LoginForm />
      </div>
    </div>
  );
}