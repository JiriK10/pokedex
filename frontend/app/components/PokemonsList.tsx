"use client"

import { useState } from "react"
import { Loading, Modal } from "@carbon/react"
import { useDebounce } from "use-debounce"

import { useSelector, topControlsSlice } from "@/lib/redux"
import {
  usePokemonQuery,
  usePokemonsQuery,
  usePokemonEvolutionsQuery,
} from "@/lib/apollo"

import Grid from "./Grid"
import List from "./List"
import PokemonInfo from "./PokemonInfo"

interface PokemonsListProps {
  parentId?: string
}

export default function PokemonsList({ parentId }: PokemonsListProps) {
  const { filter, search, pokemonType, listType } = useSelector(
    topControlsSlice.selectors.all
  )
  const [searchDebounced] = useDebounce(search, 500)
  const [infoPokemonId, setInfoPokemonId] = useState("")

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
      limit: 50,
      search: searchDebounced,
      type: pokemonType,
      favorite: filter == "favorite",
    })
    loading = pokemonsLoading
    ids = data?.pokemons.edges.map((i) => i.id)
  }

  const { data: infoData } = usePokemonQuery({
    id: infoPokemonId,
  })

  function showInfo(id: string) {
    setInfoPokemonId(id)
  }

  if (loading) {
    return <Loading withOverlay={false} className="w-12 h-12 mt-24 m-auto" />
  }

  return (
    <>
      {listType != null &&
        (listType == "grid" ? (
          <Grid ids={ids || []} onInfoClick={showInfo} />
        ) : (
          <List ids={ids || []} onInfoClick={showInfo} />
        ))}
      <Modal
        modalHeading={infoData?.pokemonById?.name}
        passiveModal
        open={!!infoPokemonId}
        onRequestClose={() => setInfoPokemonId("")}
      >
        <PokemonInfo id={infoPokemonId} />
      </Modal>
    </>
  )
}
