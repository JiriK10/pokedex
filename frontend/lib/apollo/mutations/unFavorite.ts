import { useMutation } from "@apollo/client"
import { gql } from "__generated__/gql"

import { PokemonQuery } from "../queries/pokemon"

export const UnFavoriteMutation = gql(`
  mutation UnFavorite($id: ID!) {
    unFavoritePokemon(id: $id) {
      id
    }
  }    
`)

interface UnFavoriteMutationProps {
  id: string
}

export const useUnFavoriteMutation = (props: UnFavoriteMutationProps) =>
  useMutation(UnFavoriteMutation, {
    variables: props,
    refetchQueries: [{ query: PokemonQuery, variables: props }],
    update(cache) {
      cache.evict({ fieldName: "pokemons" })
    },
  })
