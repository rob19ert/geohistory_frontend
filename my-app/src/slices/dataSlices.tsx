import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { DISCOVERER_MOCK } from '../modules/mock';
import { Discoverers } from '../api/Api';
import { setAppId, setCount } from './discoveryDraftSlice';

interface DiscoverersState {
    searchValue: string;
    discoverers: Discoverers[];
    loading: boolean;
  }

const initialState: DiscoverersState = {
  searchValue: localStorage.getItem('searchValue') || '',
  discoverers: [],
  loading: false,
};

export const getDiscoverersList = createAsyncThunk(
    'discoverers/getDiscoverersList',
    async (_, { getState, dispatch, rejectWithValue }) => {
      const { discoverers }: any = getState();
      const searchValue = discoverers.searchValue;

      console.log("🚀 Отправляем запрос в API с параметром:", searchValue);
      try {
        const response = await api.api.apiDiscoverersList({discovererName: searchValue});
        console.log("✅ API вернул данные:", response.data);
        const draft_id = response.data.draft_id;
        const draft_count = response.data.draft_count;

        dispatch(setAppId(draft_id));
        console.log("🔥 setAppId вызван с:", draft_id)
        dispatch(setCount(draft_count));
  
        return response.data;
      } catch (error) {
        return rejectWithValue('Ошибка при загрузке данных');
      }
    }
  );

const discoverersSlice = createSlice({
  name: 'discoverers',
  initialState,
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload;
      localStorage.setItem('searchValue', action.payload); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDiscoverersList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDiscoverersList.fulfilled, (state, action) => {
        state.loading = false;
        state.discoverers = action.payload.discoverers;
        
      })
      .addCase(getDiscoverersList.rejected, (state) => {
        state.loading = false;
        state.discoverers = DISCOVERER_MOCK.filter((item: { name: string; }) =>
          item.name.toLocaleLowerCase().startsWith(state.searchValue.toLocaleLowerCase())
        );
      });
  },
});

export const { setSearchValue } = discoverersSlice.actions;
export default discoverersSlice.reducer;