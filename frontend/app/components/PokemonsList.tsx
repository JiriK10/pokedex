"use client"

import { Loading } from "@carbon/react"
import { useDebounce } from "use-debounce"

import { useSelector, selectAll } from "@/lib/redux"
import { usePokemonsQuery, usePokemonEvolutionsQuery } from "@/lib/apollo"

import Grid from "./Grid"
import List from "./List"

interface PokemonsListProps {
  parentId?: string
}

export default function PokemonsList({ parentId }: PokemonsListProps) {
  const { filter, search, pokemonType, listType } = useSelector(selectAll)
  const [searchDebounced] = useDebounce(search, 500)

  let loading, ids
  if (parentId != null) {
    const { loading: pokemonEvolutionsLoading, data } =
      usePokemonEvolutionsQuery({
        id: parentId,
      })
    loading = pokemonEvolutionsLoading
    ids = data?.pokemonById?.evolutions.map((i) => i.id)
  } else {
    const { loading: pokemonsLoading, data } = usePokemonsQuery({
      offset: 0,
      limit: 20,
      search: searchDebounced,
      type: pokemonType,
      favorite: filter == "favorite",
    })
    loading = pokemonsLoading
    ids = data?.pokemons.edges.map((i) => i.id)
  }

  if (loading) {
    return <Loading withOverlay={false} className="w-12 h-12 mt-24 m-auto" />
  }

  return (
    listType != null &&
    (listType == "grid" ? <Grid ids={ids || []} /> : <List ids={ids || []} />)
  )
}
