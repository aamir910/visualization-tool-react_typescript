import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state type
interface TypeState {
  selectedType: string;
}

// Initial state for the selected type
const initialState: TypeState = {
  selectedType: '',
};

const typeSlice = createSlice({
  name: 'type',
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<string>) => {
      state.selectedType = action.payload;  // Set the selected type
    },
  },
});

export const { setType } = typeSlice.actions;
export default typeSlice.reducer;
