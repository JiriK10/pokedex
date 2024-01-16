import { createListenerMiddleware } from "@reduxjs/toolkit"

import { ReduxState } from "@/lib/redux"

export const persistMiddleware = createListenerMiddleware()
persistMiddleware.startListening({
  predicate: () => true,
  effect: async (_, listenerApi) => {
    let state = listenerApi.getState() as ReduxState
    localStorage.setItem("topControls", JSON.stringify(state.topControls))
  },
})
