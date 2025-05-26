import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginDetails: {
    username: "",
    password: "",
  },
  signupDetails: {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  errorMsg: "",
};

const authUserSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    updateLoginDetails: (state, action) => {
      const { key, value } = action.payload;
      state.loginDetails[key] = value;
    },
    updateSignupDetails: (state, action) => {
      const { key, value } = action.payload;
      state.signupDetails[key] = value;
    },
    resetDetails: (state, action) => {
      const { authType, fields } = action.payload;

      fields.forEach((field) => {
        state[authType][field] = "";
      });
    },
    setErrorMsg: (state, action) => {
      state.errorMsg = action.payload;
    },
  },
});

export const {
  updateLoginDetails,
  updateSignupDetails,
  resetDetails,
  setErrorMsg,
  clearErrorMsg,
} = authUserSlice.actions;

export default authUserSlice.reducer;


