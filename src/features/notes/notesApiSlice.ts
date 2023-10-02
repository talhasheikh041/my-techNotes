import { apiSlice } from "@/app/api/apiSlice"
import { RootStateType } from "@/app/store"
import {
  EntityState,
  createEntityAdapter,
  EntityAdapter,
  createSelector,
} from "@reduxjs/toolkit"

export type NoteStateType = {
  _id: string
  user: string
  username: string
  title: string
  text: string
  ticket: number
  completed: boolean
  id?: string
  createdAt: Date
  updatedAt: Date
}

const notesAdapter: EntityAdapter<NoteStateType> = createEntityAdapter({
  sortComparer: (a: NoteStateType, b: NoteStateType) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
})

const initialState: EntityState<NoteStateType> = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<EntityState<NoteStateType>, void>({
      query: () => ({
        url: "/notes",
        validateStatus: (response: Response, result) => {
          return response.status === 200 && !result.isError
        },
      }),

      transformResponse: (responseData: NoteStateType[]) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id
          return note
        })
        return notesAdapter.setAll(initialState, loadedNotes)
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note" as const, id })),
          ]
        } else {
          return [{ type: "Note", id: "LIST" }]
        }
      },
    }),

    createNewNote: builder.mutation<
      Record<string, any>,
      Pick<NoteStateType, "user" | "title" | "text">
    >({
      query: (newNote) => ({
        url: "/notes",
        method: "POST",
        body: {
          ...newNote,
        },
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),

    updateNote: builder.mutation<Record<string, any>, Partial<NoteStateType>>({
      query: (updateNote) => ({
        url: "/notes",
        method: "PATCH",
        body: {
          ...updateNote,
        },
      }),
      invalidatesTags: (result, error, args) => {
        return [{ type: "Note", id: args.id }]
      },
    }),

    deleteNote: builder.mutation<
      Record<string, any>,
      Pick<NoteStateType, "id">
    >({
      query: ({ id }) => ({
        url: "/notes",
        method: "DELETE",
        body: {
          id,
        },
      }),
      invalidatesTags: (result, error, args) => {
        return [{ type: "Note", id: args.id }]
      },
    }),
  }),
})

export const {
  useGetNotesQuery,
  useCreateNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice

const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data
)

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNotesIds,
} = notesAdapter.getSelectors(
  (state: RootStateType) => selectNotesData(state) ?? initialState
)
