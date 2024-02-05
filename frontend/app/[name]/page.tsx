"use client"

import { notFound } from "next/navigation"

import { usePokemonDetailQuery } from "@/lib/apollo"

import PokemonDetail from "../components/PokemonDetail"

interface ItemDetailPageProps {
  params: {
    name: string
  }
}

export default function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { loading: pokemonLoading, data: pokemonData } = usePokemonDetailQuery({
    name: decodeURI(params.name),
  })

  const pokemon = pokemonData?.pokemonByName
  if (!pokemonLoading && pokemon == null) {
    return notFound()
  }

  return <PokemonDetail pokemon={pokemon} loading={pokemonLoading} />
}
