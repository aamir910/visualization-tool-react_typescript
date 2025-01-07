import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the DataRow type for your data
interface DataRow {
  name: string;
  age: number;
  occupation: string;
}

interface DataState {
  data: DataRow[];
  CopyData: DataRow[];
  UniqueNodes: Record<string, boolean>;
  UniqueLinks: Record<string, boolean>;
  error: string | null;
  selectedNodeTypes: string[];
  selectedLinkTypes: string[];
}

const initialState: DataState = {
  data: [],
  CopyData: [],
  UniqueNodes: {},
  UniqueLinks: {},
  error: null,
  selectedNodeTypes: [],
  selectedLinkTypes: [],
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<DataRow[]>) => {
      state.data = action.payload;
      state.CopyData = action.payload;
    },
    setUniqueNodes: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.UniqueNodes = action.payload;
    },
    setUniqueLinks: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.UniqueLinks = action.payload;
      console.log( action.payload , ' action.payload  action.payload ')
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setData, setUniqueNodes, setUniqueLinks, setError } = dataSlice.actions;

export default dataSlice.reducer;
