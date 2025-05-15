import React from 'react';

interface StatsCardProps {
  icon: string;
  count: number;
  label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, count, label }) => {
  return (
    <div className="bg-white rounded-md p-5 flex items-center mb-5 shadow-md">
      <img src={icon} alt="This" className="w-[50px] h-[50px] mr-4" />
      <div>
        <h3 className="text-2xl font-bold">{count}</h3>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;