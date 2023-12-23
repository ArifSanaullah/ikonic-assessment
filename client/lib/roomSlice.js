import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  room: null,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action) => {
      state.room = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRoom } = roomSlice.actions;

export default roomSlice.reducer;
