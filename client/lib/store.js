import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/userSlice";
import roomReducer from "@/lib/roomSlice";
import toastReduce from "@/lib/toastSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      room: roomReducer,
      toast: toastReduce,
    },
  });
};
