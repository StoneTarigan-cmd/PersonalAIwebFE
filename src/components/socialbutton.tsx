import React from 'react';

interface SocialButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default SocialButton;