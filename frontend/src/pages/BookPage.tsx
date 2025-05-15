import { useEffect, useState } from 'react';
import BookForm from '../components/book/BookForm';
import BookTable from '../components/book/BookTable';
import Navbar from '../components/Navbar';
import { Book } from '../types/books';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { fetchBooksAsync, createBookAsync, updateBookAsync, deleteBookAsync } from '../store/slices/booksSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';

const BookPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, loading, error } = useAppSelector((state) => state.books);
  const { tokens } = useAppSelector((state) => state.auth);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokens) {
      navigate('/login');
    } else {
      dispatch(fetchBooksAsync());
    }
  }, [tokens, navigate, dispatch]);

  const handleAddOrUpdate = async (book: Book) => {
    try {
      if (isEdit && book.bookId) {
        await dispatch(updateBookAsync(book)).unwrap();
        toast.success('Book updated successfully!');
      } else {
        await dispatch(createBookAsync(book)).unwrap();
        toast.success('Book added successfully!');
      }
      setSelectedBook(null);
      setIsEdit(false);
    } catch (err) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} book.`);
    }
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsEdit(true);
  };

  const handleDelete = async (bookId: number) => {
    try {
      await dispatch(deleteBookAsync(bookId)).unwrap();
      toast.success('Book deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete book.');
    }
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-[222px] w-full">
        <div className="h-[65px] bg-white shadow-md flex items-center px-5">
          <img src="aa.png" alt="Logo" className="w-8 h-8 mr-2" />
          <h2 className="text-lg font-semibold">Book Info</h2>
        </div>
        <div className="bg-[#F2F2F2] p-5 h-[calc(100vh-65px)] overflow-y-auto">
          {error && <div className="bg-red-100 text-red-700 p-3 mb-4">{error}</div>}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <BookForm book={selectedBook} isEdit={isEdit} onSubmit={handleAddOrUpdate} />
              <BookTable books={books} onEdit={handleEdit} onDelete={handleDelete} />
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

export default BookPage;