"use client"

import classNames from "classNames"

import { Pokemon } from "@/__generated__/graphql"

import ListItem from "./ListItem"

interface ListProps {
  pokemons: Array<Pokemon>
  className?: string
  onInfoClick?(id: string): void
}

export default function List({ pokemons, className, onInfoClick }: ListProps) {
  return (
    <div className={classNames("flex flex-col m-3", className)}>
      {pokemons.map((pokemon) => (
        <ListItem
          key={pokemon.id}
          pokemon={pokemon}
          onInfoClick={onInfoClick}
        />
      ))}
    </div>
  )
}
