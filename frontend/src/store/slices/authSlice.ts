import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, signup } from '../../services/authService';
import { TokenService } from '../../services/tokenManagement/TokenService';
import { isTokenExpired } from '../../services/Utils/tokenUtils';
import { Tokens, LoginDTO, User } from '../../types/model';


interface AuthState {
  tokens: Tokens | null;
  userId: number | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  tokens: TokenService.getTokens(),
  userId: sessionStorage.getItem('userId') ? parseInt(sessionStorage.getItem('userId')!, 10) : null,
  username: sessionStorage.getItem('username'),
  loading: false,
  error: null,
};

export const loginAsync = createAsyncThunk('auth/login', async (credentials: LoginDTO, { rejectWithValue }) => {
  try {
    const tokens = await login(credentials);
    return { tokens, username: credentials.username };
  } catch (err) {
    return rejectWithValue('Invalid username or password');
  }
});

export const signupAsync = createAsyncThunk('auth/signup', async (user: User, { rejectWithValue }) => {
  try {
    await signup(user);
    return true;
  } catch (err) {
    return rejectWithValue('Signup failed. Please try again.');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.tokens = null;
      state.userId = null;
      state.username = null;
      TokenService.clearTokens();
    },
    validateTokens(state) {
      const tokens = TokenService.getTokens();
      if (!tokens || !tokens.refreshToken || isTokenExpired(tokens.refreshToken)) {
        state.tokens = null;
        state.userId = null;
        state.username = null;
        TokenService.clearTokens();
      } else {
        state.tokens = tokens;
        state.userId = sessionStorage.getItem('userId') ? parseInt(sessionStorage.getItem('userId')!, 10) : null;
        state.username = sessionStorage.getItem('username');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload.tokens;
        state.userId = action.payload.tokens.userId;
        state.username = action.payload.username;
        TokenService.setTokens(action.payload.tokens);
        sessionStorage.setItem('userId', action.payload.tokens.userId.toString());
        sessionStorage.setItem('username', action.payload.username);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, validateTokens } = authSlice.actions;
export default authSlice.reducer;