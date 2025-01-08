import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the DataRow type for your data
interface DataRow {
  entity_1: string;
  entity_2: string;
  entity_1_type: string;
  entity_2_type: string;
  edge_type: string;
  // Other properties can be added here
}

interface DataState {
  data: DataRow[];
  CopyData: DataRow[];
  UniqueNodes: Record<string, { type: string; value: boolean }>;
  UniqueLinks: Record<string, { type: string; value: boolean }>;
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
    setUniqueNodes: (state, action: PayloadAction<Record<string, { type: string; value: boolean }>>) => {
      state.UniqueNodes = action.payload;
      // Update CopyData based on the new UniqueNodes and UniqueLinks
      updateCopyData(state);
    },
    setUniqueLinks: (state, action: PayloadAction<Record<string, { type: string; value: boolean }>>) => {
      state.UniqueLinks = action.payload;
      // Update CopyData based on the new UniqueNodes and UniqueLinks
      updateCopyData(state);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

// Function to update CopyData based on the conditions
function updateCopyData(state: DataState) {
  state.CopyData = state.data.filter(row => {
    // Check if `entity_1_type` and `entity_2_type` are in UniqueNodes and their value is true
    const isValidNodeType =
      (state.UniqueNodes[row.entity_1_type]?.value === true) &&
      (state.UniqueNodes[row.entity_2_type]?.value === true);

    // Check if `edge_type` is in UniqueLinks and its value is true
    const isValidLinkType = state.UniqueLinks[row.edge_type]?.value === true;

    // Only include rows where all conditions are met
    return isValidNodeType && isValidLinkType;
  });
}

export const { setData, setUniqueNodes, setUniqueLinks, setError } = dataSlice.actions;

export default dataSlice.reducer;
