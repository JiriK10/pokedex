import { useQuery } from "@apollo/client"
import { gql } from "__generated__/gql"

export const PokemonEvolutionsQuery = gql(`
  query PokemonEvolutions($id: ID!) {
    pokemonById(id: $id) {
      evolutions {
        id
      }
    }
  }
`)

interface PokemonEvolutionsQueryProps {
  id: string
}

export const usePokemonEvolutionsQuery = (props: PokemonEvolutionsQueryProps) =>
  useQuery(PokemonEvolutionsQuery, {
    variables: props,
  })
