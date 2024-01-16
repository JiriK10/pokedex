/* Instruments */
import { topControlsSlice, toastsSlice } from "./slices"

export const reducer = {
  topControls: topControlsSlice.reducer,
  toasts: toastsSlice.reducer,
}
