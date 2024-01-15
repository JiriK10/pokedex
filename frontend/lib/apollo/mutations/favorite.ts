import { useMutation } from "@apollo/client"
import { gql } from "__generated__/gql"

import { PokemonQuery } from "../queries/pokemon"

export const FavoriteMutation = gql(`
  mutation Favorite($id: ID!) {
    favoritePokemon(id: $id) {
      id
    }
  }    
`)

interface FavoriteMutationProps {
  id: string
}

export const useFavoriteMutation = (props: FavoriteMutationProps) =>
  useMutation(FavoriteMutation, {
    variables: props,
    refetchQueries: [{ query: PokemonQuery, variables: props }],
    update(cache) {
      cache.evict({ fieldName: "pokemons" })
    },
  })
