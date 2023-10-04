import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react"
import { RootStateType } from "../store"

import { setCredentials } from "../../features/auth/authSlice"

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = fetchBaseQuery({
  baseUrl: "http://localhost:3500",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootStateType
    const token = state.auth.token

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  // console.log(args) // request url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions)

  // If you want, handle other status codes, too
  if (result.error?.status === 403) {
    console.log("sending refresh token")

    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions)

    if (refreshResult.data) {
      // store the new access token
      api.dispatch(setCredentials({ ...(refreshResult.data as any) }))

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (refreshResult.error?.status === 403) {
        // @ts-ignore
        refreshResult.error.data.message = "Your login has expired "
      }
      return refreshResult
    }
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 100000,
  tagTypes: ["User", "Note"],
  endpoints: (_) => ({}),
})
