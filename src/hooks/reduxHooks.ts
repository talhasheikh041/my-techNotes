import { useDispatch, useSelector } from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"
import type { RootStateType, AppDispatchType } from "@/app/store"

export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector

export const useAppDispatch: () => AppDispatchType = useDispatch
