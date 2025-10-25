"use client";

import Header from "../components/Header";
import ProgressCard from "../components/ui/ProgressCard"; // Import komponen baru
import StatCard from "../components/ui/StatCard";
import Calendar from "../components/Calendar";
import TasksList from "../components/TasksList";
import ResourceActivity from "../components/ResourceActivity";
import UpcomingEventsCard from "../components/UpcomingEventsCard";
import TaskListModal from "../components/TaskListModal"; // Import modal baru
import { useState, useEffect } from 'react'; // Tambahkan useEffect

// --- MOCK DATA TASKS ---
const mockTasksData = [
  { id: 1, title: 'Design new landing page', description: 'Create mockups for the new product landing page.', status: 'completed' },
  { id: 2, title: 'Develop API endpoints', description: 'Build the backend for user authentication.', status: 'in-progress' },
  { id: 3, title: 'Meeting with the team', description: 'Weekly sync-up to discuss project progress.', status: 'completed' },
  { id: 4, title: 'Write documentation', description: 'Document the new API endpoints for developers.', status: 'incomplete' },
  { id: 5, title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for automated deployment.', status: 'incomplete' },
  { id: 6, title: 'Code review for PR #123', description: 'Review the pull request for the new feature.', status: 'completed' },
  { id: 7, title: 'Update dependencies', description: 'Update all npm packages to their latest versions.', status: 'in-progress' },
  { id: 8, title: 'Fix navigation bug on mobile', description: 'Investigate and fix the responsive navigation issue.', status: 'incomplete' },
];

export default function DashboardPage() {
  // State untuk modal - Deklarasi state hanya sekali
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [tasksToShow, setTasksToShow] = useState(mockTasksData);

  // Pindahkan inisialisasi data ke dalam useEffect
  useEffect(() => {
    setTasksToShow(mockTasksData);
  }, []);

  const handleStatCardClick = (status: 'completed' | 'incomplete' | 'in-progress') => {
    const filteredTasks = mockTasksData.filter(task => task.status === status);
    setModalTitle(status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') + ' Tasks');
    setTasksToShow(filteredTasks);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <Header />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Kolom 1: Progress Cards, Stats, & Tasks */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProgressCard title="Daily" percentage={28} accentColor="cyan" />
            <ProgressCard title="Weekly" percentage={75} accentColor="blue" />
            <ProgressCard title="Monthly" percentage={45} accentColor="orange" />
          </div>
          
          {/* --- STATCARDS --- */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard 
              title="Completed Tasks" 
              value={tasksToShow.filter(t => t.status === 'completed').length} 
              onClick={() => handleStatCardClick('completed')}
            />
            <StatCard 
              title="Incomplete Tasks" 
              value={tasksToShow.filter(t => t.status === 'incomplete').length} 
              onClick={() => handleStatCardClick('incomplete')}
            />
            <StatCard 
              title="In Progress Tasks" 
              value={tasksToShow.filter(t => t.status === 'in-progress').length} 
              onClick={() => handleStatCardClick('in-progress')}
            />
          </div>

          <TasksList />
        </div>

        {/* Kolom 2: Calendar */}
        <div>
          <Calendar />
        </div>

        {/* Kolom 3: Upcoming Events & Resource Activity */}
        <div className="space-y-6">
          <UpcomingEventsCard />
          <ResourceActivity />
        </div>
      </div>

      {/* --- RENDER MODAL --- */}
      <TaskListModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        tasks={tasksToShow}
      />
    </div>
  );
}