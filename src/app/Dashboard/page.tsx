import Header from "../components/Header";
import ProgressCard from "../components/ui/ProgressCard"; // Import komponen baru
import StatCard from "../components/ui/StatCard";
import Calendar from "../components/Calendar";
import TasksList from "../components/TasksList";
import ResourceActivity from "../components/ResourceActivity";
import UpcomingEventsCard from "../components/UpcomingEventsCard";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <Header />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Kolom 1: Progress Cards, Stats, & Tasks */}
        <div className="space-y-6">
          {/* --- KARTU PROGRESS DENGAN DESAIN PROFESIONAL BARU --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProgressCard
              title="Daily"
              percentage={28}
              accentColor="cyan"
            />
            <ProgressCard
              title="Weekly"
              percentage={75}
              accentColor="blue"
            />
            <ProgressCard
              title="Monthly"
              percentage={45}
              accentColor="orange"
            />
          </div>
          
          {/* StatCard dan TasksList tetap di bawahnya */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard title="Tasks" value="0" />
            <StatCard title="Projects" value="2" />
            <StatCard title="Stories" value="8" />
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
    </div>
  );
}