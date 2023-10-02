import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3500",
    credentials: "include",
  }),
  keepUnusedDataFor: 100000,
  tagTypes: ["User", "Note"],
  endpoints: (_) => ({}),
})
