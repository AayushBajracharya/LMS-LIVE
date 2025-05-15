import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuthors, addAuthor, updateAuthor, deleteAuthor } from '../../services/AuthorService';
import { Author } from '../../types/authors';


interface AuthorsState {
  authors: Author[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthorsState = {
  authors: [],
  loading: false,
  error: null,
};

export const fetchAuthors = createAsyncThunk('authors/fetchAuthors', async (_, { rejectWithValue }) => {
  try {
    return await getAuthors();
  } catch (err) {
    return rejectWithValue('Failed to fetch authors.');
  }
});

export const addAuthorAsync = createAsyncThunk('authors/addAuthor', async (author: Author, { rejectWithValue }) => {
  try {
    return await addAuthor(author);
  } catch (err) {
    return rejectWithValue('Failed to add author.');
  }
});

export const updateAuthorAsync = createAsyncThunk('authors/updateAuthor', async (author: Author, { rejectWithValue }) => {
  try {
    await updateAuthor(author);
    return author;
  } catch (err) {
    return rejectWithValue('Failed to update author.');
  }
});

export const deleteAuthorAsync = createAsyncThunk('authors/deleteAuthor', async (authorID: number, { rejectWithValue }) => {
  try {
    await deleteAuthor(authorID);
    return authorID;
  } catch (err) {
    return rejectWithValue('Failed to delete author.');
  }
});

const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAuthorAsync.fulfilled, (state, action) => {
        state.authors.push(action.payload);
      })
      .addCase(addAuthorAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateAuthorAsync.fulfilled, (state, action) => {
        const index = state.authors.findIndex((a) => a.authorID === action.payload.authorID);
        if (index !== -1) {
          state.authors[index] = action.payload;
        }
      })
      .addCase(updateAuthorAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteAuthorAsync.fulfilled, (state, action) => {
        state.authors = state.authors.filter((a) => a.authorID !== action.payload);
      })
      .addCase(deleteAuthorAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default authorsSlice.reducer;