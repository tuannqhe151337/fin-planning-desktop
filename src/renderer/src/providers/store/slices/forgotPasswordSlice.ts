import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface TokenState {
  emailToken?: string;
  otpToken?: string;
}

const initialState: TokenState = {
  emailToken: "",
  otpToken: "",
};

export const tokenSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
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
export const { setEmailToken, setOtpToken, deleteEmailTokenAndOtpToken } =
  tokenSlice.actions;

export const selectEmailToken = (state: RootState) =>
  state.forgotPassword.emailToken;
export const selectOtpToken = (state: RootState) =>
  state.forgotPassword.otpToken;

export default tokenSlice.reducer;
