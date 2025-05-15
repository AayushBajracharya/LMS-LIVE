import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction } from '../../types/transaction';
import { fetchTransactions } from '../../services/transactionService';
import { createTransaction } from '../../services/IssuingService';
import { IssuingTransaction } from '../../types/issuing';
import { RootState } from '../index';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

export const fetchTransactionsAsync = createAsyncThunk('transactions/fetchTransactions', async (_, { rejectWithValue }) => {
  try {
    return await fetchTransactions();
  } catch (err) {
    return rejectWithValue('Failed to fetch transactions.');
  }
});

export const createTransactionAsync = createAsyncThunk<
  Transaction,
  IssuingTransaction,
  { state: RootState }
>('transactions/createTransaction', async (transaction: IssuingTransaction, { rejectWithValue, getState }) => {
  try {
    const transactionId = await createTransaction(transaction);
    const { auth } = getState();
    return {
      ...transaction,
      transactionId,
      user: auth.username || 'Unknown', // Use username from auth state for user field
      studentName: '',
      bookTitle: '',
      username: auth.username || 'Unknown',
    };
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to issue book.';
    return rejectWithValue(errorMessage);
  }
});

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTransactionAsync.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(createTransactionAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default transactionsSlice.reducer;