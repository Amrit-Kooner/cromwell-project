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
      // const { authType, fields } = action.payload;

      // fields.forEach((field) => {
      //   state[authType][field] = "";
      // });
    },
    // TODO: FIX
    
    clearDetails: (state, action) => {
      const authType = action.payload;
      state[authType] = { ...initialState[authType] };
    },
    setErrorMsg: (state, action) => {
      state.errorMsg = action.payload;
    },
  },
});

export const { updateLoginDetails, updateSignupDetails, resetDetails, clearDetails, setErrorMsg } = authUserSlice.actions;

export default authUserSlice.reducer;


