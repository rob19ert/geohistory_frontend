import { configureStore } from '@reduxjs/toolkit';
//import filterReducer from './slices/dataSlices';
import discoverersReducer from './slices/dataSlices';
import userReducer from './slices/userSlice'; 
import discoveryReducer from './slices/discoveryDraftSlice';
import discoveriesSliceReducer from './slices/discovererSlice'

// Создание Redux store с фильтром
const store = configureStore({
  reducer: {
    discoverers: discoverersReducer,
    user: userReducer,    
    discovery: discoveryReducer,
    discoveries: discoveriesSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // Тип для получения состояния
export type AppDispatch = typeof store.dispatch; // Тип для диспатча

export default store;