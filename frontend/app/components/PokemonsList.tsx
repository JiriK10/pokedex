"use client"

import { useEffect, useState } from "react"
import classNames from "classNames"
import { Loading, Modal } from "@carbon/react"
import { useDebounce } from "use-debounce"

import { useSelector, topControlsSlice } from "@/lib/redux"
import { Pokemon } from "@/__generated__/graphql"
import { usePokemonsQuery, usePokemonEvolutionsQuery } from "@/lib/apollo"

import TopControls from "./TopControls"
import Grid from "./Grid"
import List from "./List"
import PokemonInfo from "./PokemonInfo"

interface PokemonsListProps {
  parentId?: string
  showControls?: boolean
  caption?: string
  noItems?: string
}

const pageSize = 50
export default function PokemonsList({
  parentId,
  showControls = true,
  caption,
  noItems,
}: PokemonsListProps) {
  const { filter, search, pokemonType, listType } = useSelector(
    topControlsSlice.selectors.all
  )
  const [scrollTrigger, setScrollTrigger] = useState(0)
  const [offset, setOffset] = useState(0)
  const [searchDebounced] = useDebounce(search, 500)
  const [infoPokemonId, setInfoPokemonId] = useState("")

  // Query Pokemons
  let loading = true
  let pokemons = null
  let fetchMore = null
  if (parentId != null) {
    const { loading: pokemonEvolutionsLoading, data } =
      usePokemonEvolutionsQuery({
        id: parentId,
      })
    loading = pokemonEvolutionsLoading
    pokemons = data?.pokemonById?.evolutions.map((p) => p as Pokemon)
  } else {
    const {
      loading: pokemonsLoading,
      data,
      fetchMore: pokemonsFetchMore,
    } = usePokemonsQuery({
      offset: 0,
      limit: pageSize,
      search: searchDebounced,
      type: pokemonType,
      favorite: filter == "favorite",
    })
    loading = pokemonsLoading
    pokemons = data?.pokemons.edges.map((p) => p as Pokemon)
    fetchMore = pokemonsFetchMore
  }

  // Fetch more on scroll
  if (fetchMore) {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      if (scrollY + windowHeight >= documentHeight - 80) {
        setScrollTrigger(scrollY)
      }
    }

    useEffect(() => {
      window.addEventListener("scroll", handleScroll)
      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }, [])

    useEffect(() => {
      const loaded = pokemons?.length || 0
      if (loaded > 0 && loaded >= offset + pageSize) {
        setOffset(offset + pageSize)
      }
    }, [scrollTrigger])

    useEffect(() => {
      if (offset > 0) {
        fetchMore!({ variables: { offset } })
      }
    }, [offset])

    useEffect(() => {
      setOffset(0)
    }, [searchDebounced, pokemonType, filter])
  }

  const gridListProps = {
    pokemons: pokemons || [],
    className: showControls ? "pt-28" : "",
    onInfoClick: setInfoPokemonId,
  }
  const hasPokemons = gridListProps.pokemons.length > 0

  return (
    <>
      {showControls && <TopControls loading={loading} />}
      {caption && (hasPokemons || noItems != null) && (
        <div className="font-bold text-xl mt-6 -mb-3 pl-3">{caption}</div>
      )}
      {noItems != null && !loading && !hasPokemons && (
        <div
          className={classNames(
            gridListProps.className,
            "text-stone-500 text-2xl text-center mt-8"
          )}
        >
          {noItems}
        </div>
      )}
      {listType == "grid" && hasPokemons ? (
        <Grid {...gridListProps} />
      ) : (
        <List {...gridListProps} />
      )}
      {loading && (
        <Loading
          withOverlay={false}
          className={classNames(
            "w-12 h-12 m-auto",
            showControls && !hasPokemons ? "mt-32" : "my-16"
          )}
        />
      )}
      {infoPokemonId && (
        <Modal
          modalHeading={pokemons?.find((p) => p.id === infoPokemonId)?.name}
          passiveModal
          open={!!infoPokemonId}
          onRequestClose={() => setInfoPokemonId("")}
        >
          <PokemonInfo id={infoPokemonId} />
        </Modal>
      )}
    </>
  )
}
