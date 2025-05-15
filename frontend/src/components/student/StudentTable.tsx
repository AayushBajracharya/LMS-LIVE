import React from "react";
import { Student } from "../../types/student";


interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: number) => void; // Updated to number
}

const StudentTable: React.FC<StudentTableProps> = ({ students, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg text-gray-800 mb-3">Student Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-[#255D81] text-white">
            <tr>
              <th className="p-3 text-center">Student ID</th>
              <th className="p-3 text-center">Name</th>
              <th className="p-3 text-center">Email</th>
              <th className="p-3 text-center">Contact</th>
              <th className="p-3 text-center">Department</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.studentId} className="border-b border-gray-300 last:border-none hover:bg-gray-100">
                  <td className="p-3 text-center">{student.studentId}</td>
                  <td className="p-3 text-center">{student.name}</td>
                  <td className="p-3 text-center">{student.email}</td>
                  <td className="p-3 text-center">{student.contactNumber}</td>
                  <td className="p-3 text-center">{student.department}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onEdit(student)}
                      className="w-28 h-12 bg-yellow-600 text-white rounded-xl mr-2 hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(student.studentId)}
                      className="w-28 h-12 bg-red-600 text-white rounded-xl hover:bg-red-500 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-5 text-gray-500">
                  No students available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;