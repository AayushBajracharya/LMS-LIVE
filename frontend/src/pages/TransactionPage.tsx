import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Transaction } from '../types/transaction';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { fetchTransactionsAsync } from '../store/slices/transactionsSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';

const TransactionPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading, error } = useAppSelector((state) => state.transactions);
  const { tokens } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: selectedTransaction ? `Transaction_${selectedTransaction.transactionId}` : 'Transaction',
    onAfterPrint: () => setSelectedTransaction(null),
  });

  useEffect(() => {
    if (!tokens) {
      navigate('/login');
    } else {
      dispatch(fetchTransactionsAsync());
    }
  }, [tokens, navigate, dispatch]);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTimeout(() => {
      if (contentRef.current) {
        handlePrint();
      }
    }, 100);
  };

  const PrintableTransaction = ({ transaction }: { transaction: Transaction }) => (
    <div ref={contentRef} className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Transaction Receipt</h2>
      <div className="border p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-2">
          <p><strong>Transaction ID:</strong> {transaction.transactionId}</p>
          <p><strong>Student Name:</strong> {transaction.studentName}</p>
          <p><strong>User ID:</strong> {transaction.userId}</p>
          <p><strong>Username:</strong> {transaction.username}</p>
          <p><strong>Book Title:</strong> {transaction.bookTitle}</p>
          <p><strong>Type:</strong> {transaction.transactionType}</p>
          <p><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500">Printed on: {new Date().toLocaleString()}</p>
    </div>
  );

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-[222px] w-full">
        <div className="h-[65px] bg-white shadow-md flex items-center justify-between px-5">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="no.png" alt="Logo" className="w-8 h-8 mr-2" />
            <h2 className="text-lg font-semibold">Transaction Details</h2>
          </div>
        </div>
        <div className="bg-[#F2F2F2] p-5 h-[calc(100vh-65px)] overflow-y-auto">
          {error && <div className="bg-red-100 text-red-700 p-3 mb-4">{error}</div>}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="bg-gray-200 p-6 rounded-lg shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-md">
                  <thead className="bg-[#255D81] text-white">
                    <tr>
                      <th className="p-3 text-center">Transaction ID</th>
                      <th className="p-3 text-center">Student Name</th>
                      <th className="p-3 text-center">User ID</th>
                      <th className="p-3 text-center">Username</th>
                      <th className="p-3 text-center">Book Title</th>
                      <th className="p-3 text-center">Type</th>
                      <th className="p-3 text-center">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((txn) => (
                        <tr
                          key={txn.transactionId}
                          className="border-b border-gray-300 last:border-none hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleTransactionClick(txn)}
                        >
                          <td className="p-3 text-center">{txn.transactionId}</td>
                          <td className="p-3 text-center">{txn.studentName}</td>
                          <td className="p-3 text-center">{txn.userId}</td>
                          <td className="p-3 text-center">{txn.username}</td>
                          <td className="p-3 text-center">{txn.bookTitle}</td>
                          <td className="p-3 text-center">{txn.transactionType}</td>
                          <td className="p-3 text-center">{new Date(txn.date).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center p-5 text-gray-500">No transactions available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedTransaction && (
        <div style={{ display: 'none' }}>
          <PrintableTransaction transaction={selectedTransaction} />
        </div>
      )}
    </div>
  );
};

export default TransactionPage;