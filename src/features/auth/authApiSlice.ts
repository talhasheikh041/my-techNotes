import { apiSlice } from "../../app/api/apiSlice"
import { logout, setCredentials } from "./authSlice"

type Token = {
  accessToken: string
}

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<Token, { username: string; password: string }>({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: {
          ...credentials,
        },
      }),
    }),

    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          dispatch(logout())
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState())
          }, 1000)
        } catch (error) {
          console.log(error)
        }
      },
    }),

    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          const { accessToken } = data
          dispatch(setCredentials({ accessToken }))
        } catch (error) {
          console.log(error)
        }
      },
    }),
  }),
})

export const { useLoginMutation, useRefreshMutation, useSendLogoutMutation } =
  authApiSlice
