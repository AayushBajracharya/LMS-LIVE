import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Student } from '../types/student';
import StudentForm from '../components/student/StudentForm';
import StudentTable from '../components/student/StudentTable';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { fetchStudentsAsync, createStudentAsync, updateStudentAsync, deleteStudentAsync } from '../store/slices/studentsSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';

const StudentPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { students, loading, error } = useAppSelector((state) => state.students);
  const { tokens } = useAppSelector((state) => state.auth);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokens) {
      navigate('/login');
    } else {
      dispatch(fetchStudentsAsync());
    }
  }, [tokens, navigate, dispatch]);

  const handleAddOrUpdate = async (student: Student) => {
    try {
      if (isEdit && student.studentId) {
        await dispatch(updateStudentAsync(student)).unwrap();
        toast.success('Student updated successfully!');
      } else {
        await dispatch(createStudentAsync(student)).unwrap();
        toast.success('Student added successfully!');
      }
      setSelectedStudent(null);
      setIsEdit(false);
    } catch (err) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} student.`);
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEdit(true);
  };

  const handleDelete = async (studentId: number) => {
    try {
      await dispatch(deleteStudentAsync(studentId)).unwrap();
      toast.success('Student deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete student.');
    }
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-[222px] w-full">
        <div className="h-[65px] bg-white shadow-md flex items-center px-5">
          <h2 className="text-lg font-semibold">Student Info</h2>
        </div>
        <div className="bg-[#F2F2F2] p-5 h-[calc(100vh-65px)] overflow-y-auto">
          {error && <div className="bg-red-100 text-red-700 p-3 mb-4">{error}</div>}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <StudentForm student={selectedStudent} isEdit={isEdit} onSubmit={handleAddOrUpdate} />
              <StudentTable students={students} onEdit={handleEdit} onDelete={handleDelete} />
            </>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
};

export default StudentPage;