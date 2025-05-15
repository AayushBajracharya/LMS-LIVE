import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardData, getOverdueBorrowers } from '../../services/dashboardService';
import { Dashboard, OverdueBorrower } from '../../types/dashboard';


interface DashboardState {
  data: Dashboard | null;
  overdueBorrowers: OverdueBorrower[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  overdueBorrowers: null,
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk('dashboard/fetchData', async (_, { rejectWithValue }) => {
  try {
    const [dashboardData, overdueBorrowers] = await Promise.all([getDashboardData(), getOverdueBorrowers()]);
    return { dashboardData, overdueBorrowers };
  } catch (err) {
    return rejectWithValue('Failed to load dashboard data.');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.dashboardData;
        state.overdueBorrowers = action.payload.overdueBorrowers;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;