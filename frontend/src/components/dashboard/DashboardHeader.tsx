import React from 'react';
import User from '../../assets/User.svg';
interface DashboardHeaderProps {
  username: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ username }) => {
  return (
    <div className="fixed top-0 left-[222px] right-0 h-[65px] bg-white shadow-md flex items-center px-5 z-10">
      <img src= {User} alt="User Icon" className="w-[35px] h-[35px] mr-3" />
      <h2 className="text-lg font-semibold">{username}</h2>
    </div>
  );
};

export default DashboardHeader;