import React from 'react';

const tasks = [
  { id: 1, text: 'Design new landing page', completed: false },
  { id: 2, text: 'Develop API endpoints', completed: true },
  { id: 3, text: 'Meeting with the team', completed: false },
];

const TasksList: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Tasks</h3>
      <ul className="space-y-3">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={task.completed}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              readOnly
            />
            <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksList;