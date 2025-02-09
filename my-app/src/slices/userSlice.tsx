import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

interface UserState {
  username: string;
  isAuthenticated: boolean;
  error?: string | null; 
}

const initialState: UserState = {
  username: '',
  isAuthenticated: false,
  error: null,
};

// 🚀 Асинхронное действие для авторизации
export const loginUserAsync = createAsyncThunk(
  'user/loginUserAsync',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', { username, password }, {
        withCredentials: true,
      });

      console.log("Ответ сервера:", response.data); // 👈 Проверь, что приходит

      return {
        username: username, // 👈 Временно ставим username вручную
        ...response.data,
      };
    } catch (error: any) {
      return rejectWithValue("Ошибка авторизации");
    }
  }
);


// 🚀 Асинхронное действие для выхода
export const logoutUserAsync = createAsyncThunk(
  'user/logoutUserAsync',
  async (_, { rejectWithValue }) => {
    try {
      const csrfToken = Cookies.get('csrftoken'); // Получаем CSRF-токен

      const response = await axios.post('http://localhost:8000/logout/', 
        null, 
        {
          withCredentials: true, // Включаем отправку cookies
          
          headers: {
            'X-CSRFToken': csrfToken, // Передаем CSRF-токен
            
          },
          
        }
        
      );

      console.log("✅ Успешный выход");
      return response.data;
    } catch (error: any) {
      console.error("❌ Ошибка при выходе:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Ошибка при выходе');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        console.log("Данные, пришедшие в extraReducer:", action.payload);
        state.username = action.payload.username;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false; 
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.username = '';
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });      
  },
});

export default userSlice.reducer;
