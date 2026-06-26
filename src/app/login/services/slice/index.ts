import { createSlice } from "@reduxjs/toolkit";
import { privilegeKeys } from "src/shared/privileges";

type propsType = {
  token?: string;

  privileges?: privilegeKeys[];
};
const initialState: propsType = {
  token: "",
};

const authSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    resetAuthData: (state) => {
      state.token = undefined;
    },
    logout: (state) => {
      state.token = "invalid";
    },
    setLoginData: (state, action) => {
      state.token = action.payload.token;
    },
  },
});

export const { resetAuthData, setLoginData, logout } = authSlice.actions;
export default authSlice.reducer;
