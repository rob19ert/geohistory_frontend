import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api"; // ✅ Используем API-клиент
import Cookies from "js-cookie";

// 📌 Интерфейс первооткрывателя
interface Discoverer {
  id: number;
  name: string;
  years_of_life?: string;
  image_url?: string | null;
  long_description?: string;
  draft_count: number;
}


// 🤝 Интерфейс заявки
interface DiscoveryData {
  id: number ;
  status: string;
  region: string;
  discoverers: Discoverer[];
}

// 📌 Интерфейс состояния заявки
interface DiscoveryDraftState {
  draft_id?: number | null;
  draft_count: number;
  discoverers: Discoverer[];
  discoveryData: DiscoveryData | null;
  error: string | null;
  isDraft: boolean;
}

const initialState: DiscoveryDraftState = {
  draft_id: null,
  draft_count: 0,
  discoverers: [],
  discoveryData: null,
  error: null,
  isDraft: false,
};

// 📌 Загрузка заявки
export const discoveriesRead = createAsyncThunk(
  "discoveriesRead/getDiscoveriesRead",
  async (id: string, { rejectWithValue }) => {
    try {
      const csrfToken = Cookies.get("csrftoken"); // ✅ Получаем CSRF-токен

      console.log("📡 Отправляем запрос через API-клиент:", id);
      console.log("🔑 CSRF-токен:", csrfToken);

      const response = await api.api.apiDiscoveriesRead(id, {
        headers: {
          "X-CSRFToken": csrfToken, // ✅ Передаем CSRF-токен
          //"Referer": "http://localhost:3000", // ✅ Django требует Referer
        },
        withCredentials: true, // ✅ Передаем куки (session_id)
      });

      console.log("🔥 Ответ от сервера:", response.data);

      return {
        
        ...response.data,
        discoverers: (response.data.discoverers ?? []).map((d: any) => ({
          ...d,
          draft_count: d.draft_count ?? 0,
        })),
      };
    } catch (error) {
      console.error("❌ Ошибка при загрузке discovery:", error);
      return rejectWithValue("Ошибка загрузки данных");
    }
  }
);


export const discoveriesAddDiscovererCreate = createAsyncThunk(
  "discoveriesAdd/addDiscovererToDiscovery",
  async ({ explorer_id }: { explorer_id: number }, { rejectWithValue, dispatch }) => {
    try {
      const csrfToken = Cookies.get("csrftoken");

      console.log("📡 Отправляем запрос через API-клиент:", { explorer_id, csrfToken });

      const response = await api.api.apiDiscoveriesAddDiscovererCreate(
        { explorer_id },
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      console.log("✅ Исследователь добавлен, ответ сервера:", response);

      return response.data; // API возвращает void, тут просто response без обработки
    } catch (error) {
      console.error("❌ Ошибка при добавлении первооткрывателя:", error);

     

      return rejectWithValue("Ошибка добавления первооткрывателя");
    }
  }
);



export const deleteDiscoveries = createAsyncThunk(
  "vacancyApplication/deleteVacancyApplication",
  async (id: string, { rejectWithValue }) => {
    try {
      const csrfToken = Cookies.get("csrftoken"); // 🛠 Получаем CSRF-токен

      console.log("📡 Отправляем DELETE запрос:", id);
      console.log("🔑 CSRF-токен:", csrfToken);

      const response = await api.api.apiDiscoveriesDelete(id, {
        headers: {
          "X-CSRFToken": csrfToken, // ✅ Передаем CSRF-токен
         // "Referer": "http://localhost:3000", // ✅ Django требует Referer
        },
        withCredentials: true, // ✅ Передаем куки (session_id)
      });

      console.log("✅ Успешное удаление:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Ошибка при удалении:", error);
      return rejectWithValue(error.response?.data || "Ошибка удаления");
    }
  }
);


export const updateDiscoveries = createAsyncThunk(
  "vacancyApplication/updateVacancyApplication",
  async ({ id, discoveryData }: { id: string; discoveryData: DiscoveryData }, { rejectWithValue }) => {
    try {
      const csrfToken = Cookies.get("csrftoken");

      const allowedStatuses = ["completed", "rejected", "draft", "deleted", "formed"] as const;
      const discoveryDataToSend = {
        id: discoveryData.id,
        status: allowedStatuses.includes(discoveryData.status as any) ? discoveryData.status : "draft",
        region: discoveryData.region ?? "",
        discoverers: discoveryData.discoverers,
      };

      console.log("📡 Отправка запроса на обновление:", discoveryDataToSend);

      const response = await api.api.apiDiscoveriesUpdate(id, discoveryDataToSend, {
        headers: {
          "X-CSRFToken": csrfToken, // ✅ Добавили CSRF-токен
         // "Referer": "http://localhost:3000", // ✅ Добавили Referer
        },
        withCredentials: true, // ✅ Передаем куки
      });

      console.log("✅ Обновление успешно:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Ошибка при обновлении заявки:", error);
      return rejectWithValue("Ошибка обновления заявки");
    }
  }
);

export const submitDiscoveries = createAsyncThunk(
  "discoveries/submitDiscoveries",
  async (id: string, { rejectWithValue }) => {
    try {
      const csrfToken = Cookies.get("csrftoken");
      const response = await api.api.apiDiscoveriesSubmitUpdate(
        id, 
        {}, // 👈 Второй аргумент - тело запроса (если пустое, передаем `{}`)
        { // 👈 Третий аргумент - конфигурация запроса (заголовки)
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Ошибка при отправке заявки:", error);
      return rejectWithValue("Ошибка отправки заявки");
    }
  }
);


export const deleteDiscovererFromDiscovery = createAsyncThunk(
  "cities/deleteCityFromVacancyApplication",
  async ({ discoveryId, discovererId }: { discoveryId: number; discovererId: number }) => {
    const csrfToken = Cookies.get("csrftoken");

    await api.api.apiDiscoveriesExplorersRemoveDelete(
      discoveryId.toString(),
      discovererId.toString(),
      {
        headers: { "X-CSRFToken": csrfToken }, // Передаем токен через параметры
        withCredentials: true,
      }
    );
  }
);


// 📌 Slice для управления заявками
const discoveryDraftSlice = createSlice({
  name: "discovery",
  initialState,
  reducers: {
    setAppId: (state, action) => {
      state.draft_id = action.payload;
    },
    setCount: (state, action) => {
      state.draft_count = action.payload;
    },
    setError: (state, action) => {
      state.error = typeof action.payload === "string" ? action.payload : action.payload?.message || "Неизвестная ошибка";
    },
    setDiscoveryData: (state, action) => {
      state.discoveryData = {
          ...state.discoveryData,
          ...action.payload,
      };
    },
    setDiscoverers: (state, action) => {
      state.discoverers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      
    .addCase(discoveriesRead.fulfilled, (state, action) => {
      console.log("🔥 Reducer получил данные:", action.payload);
    
      state.discoveryData = {
        id: action.payload.id ?? 0,  // 🛠️ Заменяем undefined на 0
        status: action.payload.status,
        region: action.payload.region || "",
        discoverers: action.payload.discoverers || [],
      };
    
      state.draft_id = action.payload.id;
      state.discoverers = state.discoveryData.discoverers;
      state.isDraft = state.discoveryData.status === "draft";
    
      // 🛠️ Сохраняем ID в localStorage, если он есть
      if (action.payload.id !== undefined) {
        localStorage.setItem("draft_id", action.payload.id.toString());
        console.log("💾 Сохранён draft_id:", action.payload.id);
      } else {
        console.warn("⚠️ ID не найден, localStorage не обновлён!");
      }
    
      console.log("🔥 Обновленный state.discoveryData:", state.discoveryData);
    })
    

      // ❌ Ошибка при загрузке заявки
      .addCase(discoveriesRead.rejected, (state, action) => {
        console.error("Ошибка в discoveriesRead:", action.payload);
        state.error = action.payload as string;
      })

      // ✅ Успешное добавление первооткрывателя
      .addCase(discoveriesAddDiscovererCreate.fulfilled, (state, action) => {
        console.log("✅ Исследователь добавлен, ID:", action.payload.explorer_id);
        
        if (state.discoveryData) {
          // 🔥 Добавляем в массив нового первооткрывателя
          state.discoveryData.discoverers.push({
            id: action.payload.explorer_id,
            name: "Новый исследователь", // 📌 Попробуем временно добавить заглушку
            years_of_life: "",
            image_url: null,
            long_description: "",
            draft_count: 1,
          });
      
          state.discoverers = state.discoveryData.discoverers;
          console.log("🔥 Обновленный state.discoveryData:", state.discoveryData);
        }
      })
      

      // ❌ Ошибка при добавлении первооткрывателя
      .addCase(discoveriesAddDiscovererCreate.rejected, (state, action) => {
        console.error("Ошибка при добавлении первооткрывателя:", action.payload);
        state.error = action.payload as string;
      })
      .addCase(deleteDiscoveries.fulfilled, (state, action) => {
        localStorage.removeItem("draft_id"); // Очистка локального хранилища
        state.draft_id = null;
        state.draft_count = 0;
        state.discoverers = [];
        state.discoveryData = {
          id: null,
          status: '',
          region: '',
          discoverers: [],
        };
      })
      
      
      .addCase(deleteDiscoveries.rejected, (state) => {
        state.error = 'Ошибка при удалении вакансии';
      })
      .addCase(updateDiscoveries.fulfilled, (state, action) => {
        state.discoveryData = action.payload;
      })
      .addCase(updateDiscoveries.rejected, (state) => {
        state.error = 'Ошибка при обновлении данных';
      })
      .addCase(submitDiscoveries.fulfilled, (state, action) => {
        state.discoveryData = action.payload;
        state.isDraft = false; // Так как статус сменился
      })
      .addCase(submitDiscoveries.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Экспорт экшенов и редьюсера
export const { setAppId, setCount, setError, setDiscoveryData, setDiscoverers } = discoveryDraftSlice.actions;
export default discoveryDraftSlice.reducer;
