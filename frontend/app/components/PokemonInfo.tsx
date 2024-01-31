"use client"

import { notFound } from "next/navigation"
import {
  Loading,
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from "@carbon/react/"

import { usePokemonInfoQuery } from "@/lib/apollo"

interface PokemonInfoProps {
  id: string
}

export default function PokemonInfo({ id }: PokemonInfoProps) {
  const { loading: pokemonLoading, data: pokemonData } = usePokemonInfoQuery({
    id,
  })
  if (!id) return null
  if (pokemonLoading) {
    return <Loading withOverlay={false} className="w-12 h-12 mx-auto my-12" />
  }

  const pokemon = pokemonData?.pokemonById
  if (pokemon == null) return notFound()

  let stats: { [key: string]: any } = {
    Classification: pokemon.classification,
    Types: pokemon.types.join(", "),
    Resistant: pokemon.resistant.join(", "),
    Weaknesses: pokemon.weaknesses.join(", "),
    "Flee Rate": pokemon.fleeRate,
    "Max CP": pokemon.maxCP,
    "Max HP": pokemon.maxHP,
    Weight: `${pokemon.weight.minimum} - ${pokemon.weight.maximum}`,
    Height: `${pokemon.height.minimum} - ${pokemon.height.maximum}`,
  }
  if (pokemon.evolutionRequirements) {
    stats[
      "Evolution Requirements"
    ] = `${pokemon.evolutionRequirements?.amount} ${pokemon.evolutionRequirements?.name}`
  }

  return (
    <>
      <StructuredListWrapper isFlush isCondensed>
        <StructuredListBody>
          {Object.entries(stats).map(([name, value]) => (
            <StructuredListRow key={name}>
              <StructuredListCell noWrap className="font-bold">
                {name}
              </StructuredListCell>
              <StructuredListCell
                noWrap
                data-test={`pokemon-${name.toLowerCase().replaceAll(" ", "-")}`}
              >
                {value}
              </StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredListWrapper>
      <h2 className="mt-6 mb-1 text-xl">Attacks</h2>
      <StructuredListWrapper isFlush isCondensed>
        <StructuredListBody>
          {pokemon.attacks.fast.map(({ name, type, damage }) => (
            <StructuredListRow key={name} data-test="pokemon-attack">
              <StructuredListCell
                noWrap
                data-test="pokemon-attack-name"
                className="font-bold"
              >
                {name}
              </StructuredListCell>
              <StructuredListCell noWrap data-test="pokemon-attack-variant">
                Fast
              </StructuredListCell>
              <StructuredListCell noWrap data-test="pokemon-attack-type">
                {type}
              </StructuredListCell>
              <StructuredListCell noWrap data-test="pokemon-attack-damage">
                {damage}
              </StructuredListCell>
            </StructuredListRow>
          ))}
          {pokemon.attacks.special.map(({ name, type, damage }) => (
            <StructuredListRow key={name} data-test="pokemon-attack">
              <StructuredListCell
                noWrap
                data-test="pokemon-attack-name"
                className="font-bold"
              >
                {name}
              </StructuredListCell>
              <StructuredListCell noWrap data-test="pokemon-attack-variant">
                Special
              </StructuredListCell>
              <StructuredListCell noWrap data-test="pokemon-attack-type">
                {type}
              </StructuredListCell>
              <StructuredListCell noWrap data-test="pokemon-attack-damage">
                {damage}
              </StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredListWrapper>
    </>
  )
}
