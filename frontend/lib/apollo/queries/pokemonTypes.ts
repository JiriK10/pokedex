import { useQuery } from "@apollo/client"
import { gql } from "__generated__/gql"

export const PokemonTypesQuery = gql(`
  query PokemonTypes {
    pokemonTypes
  }
`)

export const usePokemonTypesQuery = () => useQuery(PokemonTypesQuery)
