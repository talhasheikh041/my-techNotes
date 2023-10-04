import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootStateType } from "../../app/store"

export type AuthType = {
  token: string | null
}

const initialState: AuthType = {
  token: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { accessToken } = action.payload
      state.token = accessToken
    },
    logout: (state) => {
      state.token = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

export const authReducer = authSlice.reducer

export const selectCurrentToken = (state: RootStateType) => state.auth.token
