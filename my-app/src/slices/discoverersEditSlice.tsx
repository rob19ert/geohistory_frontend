import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";
import { Discoverers } from '../api/Api';
import { DISCOVERER_MOCK } from "../modules/mock"; // мок-данные
import { setAppId, setCount } from "./discoveryDraftSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { Discoverer } from "../modules/DiscovererApi";

interface DiscoverersDetailState {
  discoverers: Discoverers | null;
  loading: boolean;
  error: string | null;
  //file: File | null;
}

const initialState: DiscoverersDetailState = {
  discoverers: null,
  loading: false,
  string: null,
  //file: null,
};
//получить первооткрывателя
export const getDiscoverersDetail = createAsyncThunk(
  "discoverer/getDiscovererDetail",
  async (id: string) => {
    const csrfToken = Cookies.get("csrftoken"); // Убедитесь, что путь корректный
    const response = await api.api.apiDiscoverersRead( id, 
      {
      withCredentials: true,
      headers: {
        "X-CSRFToken": csrfToken, // Добавление CSRF-токена в заголовки
      },
    });

    return response.data;
  }
);
//обновление
export const updateDiscoverersAsync = createAsyncThunk(
  "discoverer/updateDiscovererAsync",
  async (
    { id, discoverers }: { id: string; discoverers: Discoverers | null },
    { rejectWithValue }
  ) => {
    const csrfToken = Cookies.get("csrftoken");
    try {
      const { data } = await api.api.apiDiscoverersUpdate(
        id, discoverers,
        {
          withCredentials: true, // Включаем отправку cookies
          headers: {
            "X-CSRFToken": csrfToken,
          }, // Для передачи cookies
        }
      );
      return data; // Возвращаем данные из ответа
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Ошибка"); // Возвращаем более информативную ошибку
    }
  }
);
//добавление
export const addDiscoverersAsync = createAsyncThunk(
  "discoverer/addDiscovererAsync",
  async (
    { discoverers }: { discoverers: Discoverers | null },
    { rejectWithValue }
  ) => {
    console.log("Отправка первооткрывателя:", discoverers);

    const csrfToken = Cookies.get("csrftoken");
    try {
      const { data } = await api.api.apiDiscoverersCreate(
        discoverers,
        {
          withCredentials: true, // Включаем отправку cookies
          headers: {
            "X-CSRFToken": csrfToken,
          }, // Для передачи cookies
        }
      );
      return data; // Возвращаем данные из ответа
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Ошибка"); // Возвращаем более информативную ошибку
    }
  }
);
//удалить первооткрывателя
export const deleteDiscoverersAsync = createAsyncThunk(
  "discoverer/deleteDiscovererAsync",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    const csrfToken = Cookies.get("csrftoken");
    try {
      const { data } = await api.api.apiDiscoverersDelete(
        id,
        {
          withCredentials: true, // Включаем отправку cookies
          headers: {
            "X-CSRFToken": csrfToken,
          }, // Для передачи cookies
        }
      );
      return data; // Возвращаем данные из ответа
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Ошибка"); // Возвращаем более информативную ошибку
    }
  }
);

export const uploadImage = createAsyncThunk(
  "discoverer/uploadImage",
  async ({ id, file }: { id: string; file: File }, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("image", file);

    const csrfToken = Cookies.get("csrftoken");

    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/discoverers/${id}/upload-image/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data.image_url; // Возвращаем URL загруженного изображения
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Ошибка загрузки");
    }
  }
);



const discovererEditSlice = createSlice({
  name: "discoverersDetail",
  initialState,
  reducers: {
    setDiscoverer: (state, action) => {
      if (Object.keys(action.payload).length === 0) {
        // Если передан пустой объект, очищаем patronage
        state.discoverers = null;
      } else {
        // В другом случае обновляем patronage
        state.discoverers = {
          ...state.discoverers,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDiscoverersDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDiscoverersDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.discoverers = action.payload;
      })
      .addCase(getDiscoverersDetail.rejected, (state) => {
        state.loading = false;
      })

      .addCase(updateDiscoverersAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDiscoverersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.discoverers = action.payload;
      })
      .addCase(updateDiscoverersAsync.rejected, (state) => {
        state.loading = false;
      })

      .addCase(addDiscoverersAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDiscoverersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.discoverers = action.payload;
      })
      .addCase(addDiscoverersAsync.rejected, (state) => {
        state.loading = false;
      })

      .addCase(deleteDiscoverersAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDiscoverersAsync.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteDiscoverersAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        if (state.discoverers) {
          state.discoverers.image_url = action.payload; // Обновляем URL изображения
        }
        state.loading = false;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { setDiscoverer } = discovererEditSlice.actions;
export default discovererEditSlice.reducer;