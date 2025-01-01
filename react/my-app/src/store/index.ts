// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import typeReducer from './typeSlice';  // Import the slice reducer

// Configure the store with your reducers
const store = configureStore({
  reducer: {
    type: typeReducer,  // Add the type reducer to the store
  },
});

export default store;  // Export the store to use in the Provider component
