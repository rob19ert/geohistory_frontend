import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { api } from "../api"; // Добавил импорт api
import { Discovery } from "../api/Api"; // Убедись, что есть интерфейс Discovery
import axios from "axios";

interface DiscoveriesState {
  discoveries: Discovery[];
  loading: boolean;
  status: string;
}

const initialState: DiscoveriesState = {
  discoveries: [],
  loading: true,
  status: "",
};

export const getDiscoveries = createAsyncThunk(
  "discoveries/getDiscoveries",
  async () => {
    try {
      const csrfToken = Cookies.get("csrftoken");

      const response = await api.api.apiDiscoveriesList({}, {
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

export const completedDiscoveries = createAsyncThunk(
  "discoveries/completedDiscoveries",
  async ({ id, action }: { id: string; action: "completed" | "rejected" }, { rejectWithValue }) => {
    try {
      const csrfToken = Cookies.get("csrftoken");

      const response = await api.api.apiDiscoveriesCompleteOrRejectUpdate(
        id,
        { action }, // Передаем только объект с action в body
        {}, // Очищаем query, так как action теперь в body
        {
          headers: {
            "X-CSRFToken": csrfToken || "",
            "Content-Type": "application/json"
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Ошибка при выполнении заявки:", error);
      return rejectWithValue("Ошибка выполнения заявки");
    }
  }
);



const discoveriesSlice = createSlice({
  name: "discoveries",
  initialState,
  reducers: {
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
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
      })
      .addCase(completedDiscoveries.pending, (state) => {
        state.loading = true;
      })

      .addCase(completedDiscoveries.fulfilled, (state, action) => {
        state.loading = false;
      })

      .addCase(completedDiscoveries.rejected, (state) => {
        state.loading = true;
        console.log("error");
      });
  },
});

export default discoveriesSlice.reducer;
export const { setStatus } =
  discoveriesSlice.actions;
