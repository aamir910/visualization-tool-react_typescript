// src/redux/dataSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the DataRow type for your data
interface DataRow {
  name: string;
  age: number;
  occupation: string;
}

interface DataState {
  data: DataRow[];
  error: string | null;
}
                                                        
const initialState: DataState = {
  data: [],
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<DataRow[]>) => {
      state.data = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setData, setError } = dataSlice.actions;

export default dataSlice.reducer;
