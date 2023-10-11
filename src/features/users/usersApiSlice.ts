import { apiSlice } from "@/app/api/apiSlice"
import { RootStateType } from "@/app/store"
import {
  EntityState,
  createEntityAdapter,
  EntityAdapter,
  createSelector,
} from "@reduxjs/toolkit"
import { FetchArgs } from "@reduxjs/toolkit/query"

export type UserStateType = {
  _id: string
  username: string
  password?: string
  roles: string[]
  active: boolean
  id: string
}

const usersAdapter: EntityAdapter<UserStateType> = createEntityAdapter()

const initialState: EntityState<UserStateType> = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<UserStateType>, FetchArgs | string>({
      query: () => ({
        url: "/users",
        validateStatus: (response: Response, result) => {
          return response.status === 200 && !result.isError
        },
      }),

      transformResponse: (responseData: UserStateType[]) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id
          return user
        })
        return usersAdapter.setAll(initialState, loadedUsers)
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User" as const, id })),
          ]
        } else {
          return [{ type: "User", id: "LIST" }]
        }
      },
    }),

    createUser: builder.mutation<
      Record<string, any>,
      Pick<UserStateType, "username" | "password" | "roles">
    >({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: {
          ...newUser,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation<
      Record<string, any>,
      Omit<UserStateType, "_id">
    >({
      query: (updatedUser) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...updatedUser,
        },
      }),
      invalidatesTags: (_, __, args) => {
        return [{ type: "User", id: args.id }]
      },
    }),

    deleteUser: builder.mutation<
      Record<string, any>,
      Pick<UserStateType, "id">
    >({
      query: ({ id }) => ({
        url: "/users",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_, __, args) => [{ type: "User", id: args.id }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice

const selectUsersResult = usersApiSlice.endpoints.getUsers.select("usersList")

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
)

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUsersIds,
} = usersAdapter.getSelectors(
  (state: RootStateType) => selectUsersData(state) ?? initialState
)
