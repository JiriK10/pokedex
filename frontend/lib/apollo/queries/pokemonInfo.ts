import { useQuery } from "@apollo/client"
import { gql } from "__generated__/gql"

export const PokemonInfoQuery = gql(`
  query PokemonInfo($id: ID!) {
    pokemonById(id: $id) {
      id
      name
      classification
      types
      resistant
      weaknesses
      fleeRate
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
      attacks {
        fast {
          name
          type
          damage
        }
        special {
          name
          type
          damage
        }
      }
      evolutionRequirements {
        name
        amount
      }
    }
  }
`)

interface PokemonInfoQueryProps {
  id: string
}

export const usePokemonInfoQuery = (props: PokemonInfoQueryProps) =>
  useQuery(PokemonInfoQuery, {
    variables: props,
    skip: !props.id,
  })
