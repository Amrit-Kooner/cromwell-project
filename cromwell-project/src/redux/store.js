import { configureStore } from "@reduxjs/toolkit";
import authUserReducer from "./slices/authUserSlice";

const store = configureStore({
  reducer: {
    authUser: authUserReducer,
  },
});

export default store;

