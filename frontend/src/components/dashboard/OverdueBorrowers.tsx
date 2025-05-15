import React from 'react';
import { OverdueBorrower } from '../../types/dashboard';
import Borrow from '../../assets/BorrowerUser.svg';

interface OverdueBorrowersProps {
  borrowers: OverdueBorrower[] | null;
}

const OverdueBorrowers: React.FC<OverdueBorrowersProps> = ({ borrowers }) => {
  // Handle null or empty borrowers
  if (!borrowers || borrowers.length === 0) {
    return (
      <div className="bg-white rounded-lg p-5 shadow-md">
        <h5 className="text-lg font-semibold mb-4">Overdue Borrowers</h5>
        <p className="text-gray-500">No overdue borrowers found.</p>
      </div>
    );
  }

  return (
<div className="bg-white rounded-lg p-4 shadow-md">
      <h5 className="text-base font-semibold mb-3">Overdue Borrowers</h5>
      <div className="max-h-[150px] overflow-y-auto flex flex-wrap gap-3">
        {borrowers.map((borrower) => (
          <div
            key={borrower.borrowedId}
            className="w-[500px] h-[50px] border border-gray-300 rounded-lg flex items-center p-3 shadow-sm bg-white"
          >
            <div className="w-[24px] h-[24px] border-r-2 border-black pr-2 flex justify-center items-center">
              <img src={Borrow} alt="Icon" className="w-4 h-4" />
            </div>
            <div className="ml-3 flex flex-col justify-center">
              <span className="text-sm font-bold">{borrower.borrowedId}</span>
              <span className="text-sm text-gray-500">{borrower.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverdueBorrowers;