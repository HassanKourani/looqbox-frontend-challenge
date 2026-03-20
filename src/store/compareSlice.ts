import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const MAX_COMPARE = 3;

interface CompareState {
  names: string[];
}

const initialState: CompareState = {
  names: [],
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    toggleCompare(state, action: PayloadAction<string>) {
      const name = action.payload;
      const index = state.names.indexOf(name);
      if (index >= 0) {
        state.names.splice(index, 1);
      } else if (state.names.length < MAX_COMPARE) {
        state.names.push(name);
      }
    },
    removeFromCompare(state, action: PayloadAction<string>) {
      state.names = state.names.filter((n) => n !== action.payload);
    },
    clearCompare(state) {
      state.names = [];
    },
  },
});

export const { toggleCompare, removeFromCompare, clearCompare } =
  compareSlice.actions;
export default compareSlice.reducer;
