import { useQuery } from "@apollo/client"
import { gql } from "__generated__/gql"

export const PokemonIdQuery = gql(`
  query PokemonId($name: String!) {
    pokemonByName(name: $name) {
      id
    }
  }
`)

interface PokemonIdQueryProps {
  name: string
}

export const usePokemonIdQuery = (props: PokemonIdQueryProps) =>
  useQuery(PokemonIdQuery, {
    variables: props,
    skip: !props.name,
  })
