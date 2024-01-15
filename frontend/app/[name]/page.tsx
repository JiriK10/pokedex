"use client"

import { notFound } from "next/navigation"
import { Loading } from "@carbon/react"

import { usePokemonIdQuery } from "@/lib/apollo"

import PokemonDetail from "../components/PokemonDetail"

interface ItemDetailPageProps {
  params: {
    name: string
  }
}

export default function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { loading: pokemonIdLoading, data: pokemonIdData } = usePokemonIdQuery({
    name: params.name,
  })

  if (pokemonIdLoading) {
    return <Loading withOverlay={false} className="w-12 h-12 mt-24 m-auto" />
  }

  let pokemonId = pokemonIdData?.pokemonByName?.id
  if (pokemonId == null) {
    return notFound()
  }

  return <PokemonDetail id={pokemonId} />
}
