import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  message: null,
  title: "Alert",
  icon: "info", // success | info | error | warning
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setIcon: (state, action) => {
      state.icon = action.payload;
    },
    showToast: (state, action) => {
      state.icon = action.payload.icon;
      state.isOpen = true;
      state.message = action.payload.message;
      state.title = action.payload.title;
    },
    hideToast: (state, action) => {
      state.isOpen = false;
      state.message = null;
      state.title = "Alert";
      state.icon = "info";
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIcon,
  setIsOpen,
  setMessage,
  setTitle,
  hideToast,
  showToast,
} = toastSlice.actions;

export default toastSlice.reducer;
