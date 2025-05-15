import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import AuthorForm from '../components/author/AuthorForm';
import AuthorTable from '../components/author/AuthorTable';
import Navbar from '../components/Navbar';
import { Author } from '../types/authors';
import { useNavigate } from 'react-router-dom';
import { fetchAuthors, addAuthorAsync, updateAuthorAsync, deleteAuthorAsync } from '../store/slices/authorsSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';

const AuthorPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { authors, loading, error } = useAppSelector((state) => state.authors);
  const { tokens } = useAppSelector((state) => state.auth);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokens) {
      navigate('/login');
    } else {
      dispatch(fetchAuthors());
    }
  }, [tokens, navigate, dispatch]);

  const handleAddOrUpdate = async (author: Author) => {
    try {
      if (isEdit && author.authorID) {
        await dispatch(updateAuthorAsync(author)).unwrap();
        toast.success('Author updated successfully!');
      } else {
        await dispatch(addAuthorAsync(author)).unwrap();
        toast.success('Author added successfully!');
      }
      setSelectedAuthor(null);
      setIsEdit(false);
    } catch (err) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} author.`);
    }
  };

  const handleEdit = (author: Author) => {
    setSelectedAuthor(author);
    setIsEdit(true);
  };

  const handleDelete = async (authorId: number) => {
    try {
      await dispatch(deleteAuthorAsync(authorId)).unwrap();
      toast.success('Author deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete author.');
    }
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-[222px] w-full">
        <div className="h-[65px] bg-blue shadow-md flex items-center px-5">
          <h2 className="text-lg font-semibold">Author Info</h2>
        </div>
        <div className="bg-gray-200 p-5 h-[calc(100vh-65px)] overflow-y-auto">
          {error && <div className="bg-red-100 text-red-700 p-3 mb-4">{error}</div>}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <AuthorForm author={selectedAuthor} isEdit={isEdit} onSubmit={handleAddOrUpdate} />
              <AuthorTable authors={authors} onEdit={handleEdit} onDelete={handleDelete} />
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

export default AuthorPage;