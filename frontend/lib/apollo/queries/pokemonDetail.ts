import { useQuery } from "@apollo/client"
import { gql } from "__generated__/gql"

export const PokemonDetailQuery = gql(`
  query PokemonDetail($id: ID!) {
    pokemonById(id: $id) {
      id
      name
      types
      isFavorite
      image
      sound
      maxCP
      maxHP
      weight {
        minimum
        maximum
      }
      height {
        minimum
        maximum
      }
    }
  }
`)

interface PokemonDetailQueryProps {
  id: string
}

export const usePokemonDetailQuery = (props: PokemonDetailQueryProps) =>
  useQuery(PokemonDetailQuery, {
    variables: props,
  })
