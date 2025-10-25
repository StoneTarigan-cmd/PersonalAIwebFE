// src/components/TaskListModal.tsx
'use client';

import React from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
}

interface TaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tasks: Task[];
}

const TaskListModal: React.FC<TaskListModalProps> = ({ isOpen, onClose, title, tasks }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        
        <div 
          className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-500 ease-out"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: 'modalFadeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* Header Modal */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-3xl font-bold text-white">{title}</h3>
              <p className="text-sm text-blue-200 mt-1">
                {tasks.length} {tasks.length > 1 ? 'tasks' : 'task'} found
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white">{task.title}</h4>
                  <p className="text-sm text-gray-300 mt-1">{task.description}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">No tasks found.</p>
            )}
          </div>
          
          <div className="mt-8 flex justify-end">
            {/* <button
              onClick={onClose}
              className="px-6 py-3 bg-white text-slate-800 font-semibold rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg"
            >
              Close
            </button> */}
          </div>
        </div>
      </div>

      {/* CSS untuk animasi dan scrollbar ditempatkan di sini */}
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

export default TaskListModal; // EKSPOR NAMA YANG SAMA