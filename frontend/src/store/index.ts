import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import authorsReducer from './slices/authorsSlice';
import booksReducer from './slices/booksSlice';
import studentsReducer from './slices/studentsSlice';
import transactionsReducer from './slices/transactionsSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authors: authorsReducer,
    books: booksReducer,
    students: studentsReducer,
    transactions: transactionsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;