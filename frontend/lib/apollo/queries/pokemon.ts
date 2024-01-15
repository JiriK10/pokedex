import { useQuery } from "@apollo/client"
import { gql } from "__generated__/gql"

export const PokemonQuery = gql(`
  query Pokemon($id: ID!) {
    pokemonById(id: $id) {
      id
      name
      types
      isFavorite
      image
    }
  }
`)

interface PokemonQueryProps {
  id: string
}

export const usePokemonQuery = (props: PokemonQueryProps) =>
  useQuery(PokemonQuery, {
    variables: props,
  })
