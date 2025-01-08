import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the DataRow type for your data
interface DataRow {
  entity_1: string;
  entity_2: string;
  entity_1_type: string;
  entity_2_type: string;
  edge_type: string;
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
  name: "data",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<DataRow[]>) => {
      state.data = action.payload;
      state.CopyData = action.payload;
    },
    setUniqueNodes: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.UniqueNodes = action.payload;

      // Filter CopyData to keep only rows where both nodes are visible
      state.CopyData = state.data.filter(
        (row) =>
          action.payload[row.entity_1_type] !== false &&
          action.payload[row.entity_2_type] !== false     
      );
    },
    setUniqueLinks: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.UniqueLinks = action.payload;

      // Filter CopyData to keep only rows where the edge type is visible
      state.CopyData = state.data.filter(
        (row) => action.payload[row.edge_type] !== false
      );
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setData, setUniqueNodes, setUniqueLinks, setError } = dataSlice.actions;

export default dataSlice.reducer;
