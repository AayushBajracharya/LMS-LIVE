import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../../services/studentService';
import { Student } from '../../types/student';


interface StudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  students: [],
  loading: false,
  error: null,
};

export const fetchStudentsAsync = createAsyncThunk('students/fetchStudents', async (_, { rejectWithValue }) => {
  try {
    return await fetchStudents();
  } catch (err) {
    return rejectWithValue('Failed to fetch students.');
  }
});

export const createStudentAsync = createAsyncThunk('students/createStudent', async (student: Student, { rejectWithValue }) => {
  try {
    return await createStudent(student);
  } catch (err) {
    return rejectWithValue('Failed to add student.');
  }
});

export const updateStudentAsync = createAsyncThunk('students/updateStudent', async (student: Student, { rejectWithValue }) => {
  try {
    await updateStudent(student);
    return student;
  } catch (err) {
    return rejectWithValue('Failed to update student.');
  }
});

export const deleteStudentAsync = createAsyncThunk('students/deleteStudent', async (studentId: number, { rejectWithValue }) => {
  try {
    await deleteStudent(studentId);
    return studentId;
  } catch (err) {
    return rejectWithValue('Failed to delete student.');
  }
});

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createStudentAsync.fulfilled, (state, action) => {
        state.students.push(action.payload);
      })
      .addCase(createStudentAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateStudentAsync.fulfilled, (state, action) => {
        const index = state.students.findIndex((s) => s.studentId === action.payload.studentId);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(updateStudentAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteStudentAsync.fulfilled, (state, action) => {
        state.students = state.students.filter((s) => s.studentId !== action.payload);
      })
      .addCase(deleteStudentAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default studentsSlice.reducer;