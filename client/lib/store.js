import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/userSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
  });
};
