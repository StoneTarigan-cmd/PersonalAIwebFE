import React from 'react';

const activities = [
  { id: 1, user: 'John Doe', action: 'uploaded a new file', time: '2 hours ago', avatar: 'JD' },
  { id: 2, user: 'Jane Smith', action: 'commented on your post', time: '5 hours ago', avatar: 'JS' },
  { id: 3, user: 'Mike Johnson', action: 'completed a task', time: '1 day ago', avatar: 'MJ' },
];

const ResourceActivity: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Resource Activity</h3>
      <ul className="space-y-4">
        {activities.map(activity => (
          <li key={activity.id} className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
              {activity.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-semibold">{activity.user}</span> {activity.action}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceActivity;