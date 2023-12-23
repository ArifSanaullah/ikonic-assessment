import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/userSlice";
import roomReducer from "@/lib/roomSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      room: roomReducer,
    },
  });
};
