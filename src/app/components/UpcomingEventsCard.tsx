// src/components/UpcomingEventsCard.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

// --- Fungsi Pembuat Data ---
const createRandomEvent = (date: Date) => {
  const eventTemplates = [
    { name: 'Team Sync-Up', detail: 'Weekly team standup meeting to discuss progress.' },
    { name: 'Project Deadline', detail: 'Submit final design mockups for review.' },
    { name: 'Client Call', detail: 'Discuss new feature requirements and provide a demo.' },
    { name: 'Design Review', detail: 'Review UI/UX improvements for the dashboard.' },
    { name: 'Sprint Planning', detail: 'Plan tasks and goals for the upcoming sprint.' },
    { name: '1-on-1 with Manager', detail: 'Monthly check-in and performance discussion.' },
  ];
  if (Math.random() > 0.4) {
    const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    const eventDate = new Date(date);
    eventDate.setHours(Math.floor(Math.random() * 9) + 9);
    eventDate.setMinutes(Math.random() > 0.5 ? 0 : 30);
    return { id: eventDate.getTime(), name: template.name, date: eventDate, detail: template.detail };
  }
  return null;
};

const getEventsForNextWeek = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const events = [];
  for (let i = 0; i < 7; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);
    const event = createRandomEvent(futureDate);
    if (event) {
      events.push(event);
    }
  }
  events.sort((a, b) => a.date.getTime() - b.date.getTime());
  return events;
};

// --- KOMPONEN UTAMA ---
const UpcomingEventsCard: React.FC = () => {
  // --- STATE & REFS ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Week');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ReturnType<typeof createRandomEvent> | null>(null);
  const [events, setEvents] = useState<ReturnType<typeof createRandomEvent>[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const options = ['Week', 'Month', 'Year'];

  // --- EFFECTS ---
  useEffect(() => {
    setEvents(getEventsForNextWeek());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  // --- FUNCTIONS ---
  const formatEventDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    if (eventDate.getTime() === today.getTime()) {
      return 'Today';
    }
    return eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const selectOption = (option: string) => { setSelectedRange(option); setIsDropdownOpen(false); };
  const openModal = (event: ReturnType<typeof createRandomEvent>) => {
    if (event) { // Pastikan event tidak null
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };
  const closeModal = () => { setIsModalOpen(false); };

  // --- RENDER ---
  return (
    <>
      {/* --- KARTU UTAMA --- */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-700/50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
          <div className="flex items-center space-x-3">
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="flex items-center space-x-2 text-sm font-medium bg-slate-700/50 hover:bg-slate-700/70 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50">
                <span>{selectedRange}</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-slate-800 text-white rounded-lg shadow-xl z-10 overflow-hidden border border-slate-600">
                  {options.map((option: string) => (
                    <button key={option} onClick={() => selectOption(option)} className="block w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors duration-150">{option}</button>
                  ))}
                </div>
              )}
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md">
              All Events
            </button>
          </div>
        </div>

        {/* Daftar Event - DENGAN FILTER UNTUK MENGHILANGKAN NULL */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {events.filter(event => event !== null).map((event) => (
            <div key={event.id} className="bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 border-l-4 border-blue-500 transition-all duration-200 group">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">{event.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{formatEventDate(event.date)}</p>
                </div>
                <button onClick={() => openModal(event)} className="ml-4 p-2 rounded-lg bg-slate-600/50 hover:bg-slate-600/70 transition-all duration-200" title="View Details">
                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL - DENGAN OPTIONAL CHAINING UNTUK KEAMANAN --- */}
      {isModalOpen && selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          
          <div 
            className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-500 ease-out"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'modalFadeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                {/* Gunakan optional chaining di sini */}
                <h3 className="text-3xl font-bold text-white">{selectedEvent?.name}</h3>
                <p className="text-sm text-blue-200 mt-1">
                  {selectedEvent?.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white">
                  {selectedEvent?.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex items-start space-x-3 bg-white/5 rounded-lg p-3">
                <svg className="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-white text-sm leading-relaxed">{selectedEvent?.detail}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CSS --- */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.3); }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.2) transparent; }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default UpcomingEventsCard;