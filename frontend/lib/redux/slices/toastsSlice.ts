import crypto from "crypto"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type ToastKind =
  | "error"
  | "info"
  | "info-square"
  | "success"
  | "warning"
  | "warning-alt"

export interface Toast {
  id: string
  title: string
  kind: ToastKind
}

export interface ToastsSliceState {
  toasts: Array<Toast>
}

const initialState: ToastsSliceState = {
  toasts: [],
}

export const toastsSlice = createSlice({
  name: "toasts",
  initialState,
  reducers: {
    add: (state, toast: PayloadAction<{ title: string; kind?: ToastKind }>) => {
      state.toasts.push({
        id: crypto.randomBytes(16).toString("hex"),
        title: toast.payload.title,
        kind: toast.payload.kind || "success",
      })
    },
    remove: (state, toastId: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id != toastId.payload)
    },
  },
  selectors: {
    toasts: (state) => state.toasts,
  },
})
