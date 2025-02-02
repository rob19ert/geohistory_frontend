import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/dataSlices';

// Создание Redux store с фильтром
const store = configureStore({
  reducer: {
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // Тип для получения состояния
export type AppDispatch = typeof store.dispatch; // Тип для диспатча

export default store;