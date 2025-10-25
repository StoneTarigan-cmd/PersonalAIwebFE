'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  // { icon: '📦', text: 'App', href: '/dashboard' },
  { icon: '📊', text: 'Dashboard', href: '/dashboard' },
  { icon: '📧', text: 'Email', href: '/dashboard/email' },
  { icon: '💬', text: 'Chat', href: '/dashboard/chat' },
  // { icon: '👥', text: 'Contacts', href: '/dashboard/contacts' },
  { icon: '📝', text: 'Notes', href: '/dashboard/notes' },
  // { icon: '📅', text: 'Calendar', href: '/dashboard/calendar' },
  { icon: '⚙️', text: 'Settings', href: '/dashboard/settings' },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        PersonalAI
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;