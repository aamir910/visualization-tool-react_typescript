// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import typeReducer from './typeSlice';  // Import the slice reducer
import dataReducer  from './data/dataSlice';

// Configure the store with your reducers
const store = configureStore({
  reducer: {
    type: typeReducer,
    data : dataReducer  // Add the type reducer to the store
  },
});

export type RootState = ReturnType<typeof store.getState>;  // <-- This defines the RootState type
export default store;  // Export the store to use in the Provider component
