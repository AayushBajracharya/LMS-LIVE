import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBooks, createBook, updateBook, deleteBook } from '../../services/bookService';
import { Book } from '../../types/books';

interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
};

export const fetchBooksAsync = createAsyncThunk('books/fetchBooks', async (_, { rejectWithValue }) => {
  try {
    return await fetchBooks();
  } catch (err) {
    return rejectWithValue('Failed to fetch books.');
  }
});

export const createBookAsync = createAsyncThunk('books/createBook', async (book: Book, { rejectWithValue }) => {
  try {
    return await createBook(book);
  } catch (err) {
    return rejectWithValue('Failed to add book.');
  }
});

export const updateBookAsync = createAsyncThunk('books/updateBook', async (book: Book, { rejectWithValue }) => {
  try {
    await updateBook(book);
    return book;
  } catch (err) {
    return rejectWithValue('Failed to update book.');
  }
});

export const deleteBookAsync = createAsyncThunk('books/deleteBook', async (bookId: number, { rejectWithValue }) => {
  try {
    await deleteBook(bookId);
    return bookId;
  } catch (err) {
    return rejectWithValue('Failed to delete book.');
  }
});

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBookAsync.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(createBookAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateBookAsync.fulfilled, (state, action) => {
        const index = state.books.findIndex((b) => b.bookId === action.payload.bookId);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(updateBookAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteBookAsync.fulfilled, (state, action) => {
        state.books = state.books.filter((b) => b.bookId !== action.payload);
      })
      .addCase(deleteBookAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default booksSlice.reducer;