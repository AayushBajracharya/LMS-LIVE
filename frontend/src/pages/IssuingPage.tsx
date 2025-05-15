import { toast } from 'react-toastify';
import IssuingForm from '../components/issue/IssuingForm';
import Navbar from '../components/Navbar';
import { IssuingTransaction } from '../types/issuing';
import { useNavigate } from 'react-router-dom';
import { createTransactionAsync } from '../store/slices/transactionsSlice';
import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchBooksAsync } from '../store/slices/booksSlice';
import { fetchStudentsAsync } from '../store/slices/studentsSlice';

const IssuingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tokens, error: authError } = useAppSelector((state) => state.auth);
  const { loading: studentsLoading, error: studentsError } = useAppSelector((state) => state.students);
  const { loading: booksLoading, error: booksError } = useAppSelector((state) => state.books);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokens) {
      navigate('/login');
    } else {
      dispatch(fetchStudentsAsync());
      dispatch(fetchBooksAsync());
    }
  }, [tokens, navigate, dispatch]);

  const handleIssueBook = async (transaction: IssuingTransaction) => {
    try {
      await dispatch(createTransactionAsync(transaction)).unwrap();
      toast.success('Book issued successfully!');
    } catch (err: any) {
      toast.error('Failed to issue book.');
    }
  };

  const loading = studentsLoading || booksLoading;
  const error = authError || studentsError || booksError;

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-[222px] w-full">
        <div
          className="header"
          style={{
            height: '65px',
            background: '#fff',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="no.png" alt="Issue Book Icon" style={{ width: '35px', height: '35px', marginRight: '10px' }} />
            <h2 style={{ fontSize: '18px', margin: '0' }}>Issue Book</h2>
          </div>
        </div>
        <div
          className="body"
          style={{
            background: '#F2F2F2',
            padding: '20px',
            height: 'calc(100vh - 65px)',
            overflowY: 'auto',
          }}
        >
          {error && (
            <div style={{ background: '#fdd', color: '#d00', padding: '10px', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <IssuingForm onSubmit={handleIssueBook} />
          )}
        </div>
      </div>
    </div>
  );
};

export default IssuingPage;