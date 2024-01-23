import { useQuery } from "@apollo/client"
import { gql } from "__generated__/gql"

export const PokemonsQuery = gql(`
  query Pokemons($offset: Int!, $limit: Int!, $search: String!, $type: String!, $favorite: Boolean!)  {
    pokemons(
      query: {
        offset: $offset
        limit: $limit
        search: $search
        filter: { type: $type, isFavorite: $favorite }
      }
    ) {
      edges {
        id
        name
        types
        isFavorite
        image
      }
    }
  }    
`)

interface PokemonsQueryProps {
  offset: number
  limit: number
  search: string
  type: string
  favorite: boolean
}

export const usePokemonsQuery = (props: PokemonsQueryProps) =>
  useQuery(PokemonsQuery, {
    variables: props,
    notifyOnNetworkStatusChange: true,
  })
