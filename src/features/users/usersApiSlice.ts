import { apiSlice } from "@/app/api/apiSlice"
import { RootStateType } from "@/app/store"
import {
  EntityState,
  createEntityAdapter,
  EntityAdapter,
  createSelector,
} from "@reduxjs/toolkit"

type UserStateType = {
  _id: string
  username: string
  password?: string
  roles: string[]
  active: boolean
  id?: string
}

const usersAdapter: EntityAdapter<UserStateType> = createEntityAdapter()

const initialState: EntityState<UserStateType> = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<UserStateType>, void>({
      query: () => "/users",
      // @ts-ignore
      validateStatus: (response: Response, result) => {
        return response.status === 200 && !result.isError
      },
      keepUnusedDataFor: 5,
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
  }),
})

export const { useGetUsersQuery } = usersApiSlice

const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

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
