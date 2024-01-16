import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type TopControlsFilterType = "all" | "favorite"
export type TopControlsListType = "grid" | "list"

export interface TopControlsSliceState {
  filter: TopControlsFilterType
  search: string
  pokemonType: string
  listType?: TopControlsListType
}

const initialState: TopControlsSliceState = {
  filter: "all",
  search: "",
  pokemonType: "",
}

export const topControlsSlice = createSlice({
  name: "topControls",
  initialState,
  reducers: {
    restore: (state, newState: PayloadAction<TopControlsSliceState>) => {
      state.filter = newState.payload.filter
      state.search = newState.payload.search
      state.pokemonType = newState.payload.pokemonType
      state.listType = newState.payload.listType
    },
    filter: (state, filter: PayloadAction<TopControlsFilterType>) => {
      state.filter = filter.payload
    },
    search: (state, search: PayloadAction<string>) => {
      state.search = search.payload
    },
    pokemonType: (state, type: PayloadAction<string>) => {
      state.pokemonType = type.payload
    },
    listType: (state, type: PayloadAction<TopControlsListType>) => {
      state.listType = type.payload
    },
  },
  selectors: {
    all: (state) => state,
  },
})
