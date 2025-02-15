import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { api } from "../api";

interface UserState {
  //id: number,
  username: string;
  email: string,
  isAuthenticated: boolean;
  error?: string | null; 
  isSuperUser: boolean;
}

const initialState: UserState = {
  //id: 0,
  username: '',
  email: '',
  isAuthenticated: false,
  error: null,
  isSuperUser: false,
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
      localStorage.setItem("token", response.data.token); // ✅ Сохраняем токен

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

export const updateUserAsync = createAsyncThunk(
  "user/updateAsync",
  async (
    {  username, password, email }: {  username: string; password?: string; email?: string },
    { rejectWithValue }
  ) => {
    try {
      const csrfToken = Cookies.get("csrftoken");
      console.log("CSRF Token:", csrfToken);

      const response = await api.api.apiUpdateProfileUpdate(
        { username, email, password },
        {
          headers: {
            "X-CSRFToken": csrfToken || "",
          },
          withCredentials: true,
        }
      );

      console.log("Ответ бэка после обновления:", response.data);
      console.log("CSRF Token:", csrfToken);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Ошибка обновления профиля");
    }
  }
);




export const regUsersAsync = createAsyncThunk(
  "user/regUserAsync",
  async (
    { id, username, email, password }: { id:number, username: string; password: string; email: string },
    { rejectWithValue }
  ) => {
    try {
      const csrfToken = Cookies.get("csrftoken");
      const response = await api.api.apiUsersCreate(
        {id, username, email, password },
        {
          headers: {
            "X-CSRFToken": csrfToken || "",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Ошибка авторизации");
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
       // state.id = action.payload.id;
        state.username = action.payload.username;
        state.isAuthenticated = true;
        state.isSuperUser = Boolean(action.payload.is_superuser); // Явно приводим к true/false
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
        state.isSuperUser=false;
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const { username } = action.payload;
        state.username = username;
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(regUsersAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(regUsersAsync.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(regUsersAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
export const {} = userSlice.actions;
