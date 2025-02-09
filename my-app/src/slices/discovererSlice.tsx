import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { api } from "../api"; // Добавил импорт api
import { Discovery } from "../api/Api"; // Убедись, что есть интерфейс Discovery

interface DiscoveriesState {
  discoveries: Discovery[];
  loading: boolean;
}

const initialState: DiscoveriesState = {
  discoveries: [],
  loading: true,
};

export const getDiscoveries = createAsyncThunk(
  "discoveries/getDiscoveries",
  async () => {
    try {
      const csrfToken = Cookies.get("csrftoken");

      const response = await api.discoveries.discoveriesList({}, {
        headers: {
          "X-CSRFToken": csrfToken || "", // Добавил обработку отсутствия токена
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Ошибка при загрузке открытий:", error);
      throw error;
    }
  }
);

const discoveriesSlice = createSlice({
  name: "discoveries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDiscoveries.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDiscoveries.fulfilled, (state, action) => {
        state.loading = false;
        state.discoveries = action.payload;
      })
      .addCase(getDiscoveries.rejected, (state) => {
        state.loading = false; // При ошибке отключаем загрузку
        console.log("Ошибка загрузки открытий");
      });
  },
});

export default discoveriesSlice.reducer;
