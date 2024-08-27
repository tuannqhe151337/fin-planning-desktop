import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface ForgotPasswordState {
  email?: string;
  emailToken?: string;
  otpToken?: string;
}

const initialState: ForgotPasswordState = {
  email: "",
  emailToken: "",
  otpToken: "",
};

export const tokenSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setEmailToken: (state, action: PayloadAction<string>) => {
      state.emailToken = action.payload;
    },
    setOtpToken: (state, action: PayloadAction<string>) => {
      state.otpToken = action.payload;
    },
    deleteEmailTokenAndOtpToken: (state) => {
      state.emailToken = undefined;
      state.otpToken = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setEmail,
  setEmailToken,
  setOtpToken,
  deleteEmailTokenAndOtpToken,
} = tokenSlice.actions;

export const selectEmail = (state: RootState) => state.forgotPassword.email;
export const selectEmailToken = (state: RootState) =>
  state.forgotPassword.emailToken;
export const selectOtpToken = (state: RootState) =>
  state.forgotPassword.otpToken;

export default tokenSlice.reducer;
