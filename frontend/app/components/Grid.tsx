"use client"

import classNames from "classNames"

import { Pokemon } from "@/__generated__/graphql"

import GridItem from "./GridItem"

interface GridProps {
  pokemons: Array<Pokemon>
  className?: string
  onInfoClick?(id: string): void
}

export default function Grid({ pokemons, className, onInfoClick }: GridProps) {
  return (
    <div
      data-test="grid"
      className={classNames(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 mx-3 my-4",
        className
      )}
    >
      {pokemons.map((pokemon) => (
        <GridItem
          key={pokemon.id}
          pokemon={pokemon}
          onInfoClick={onInfoClick}
        />
      ))}
    </div>
  )
}
