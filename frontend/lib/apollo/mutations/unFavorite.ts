import { useMutation } from "@apollo/client"

import { gql } from "__generated__/gql"
import { reduxStore, toastsSlice } from "@/lib/redux"

import { PokemonQuery } from "../queries/pokemon"

export const UnFavoriteMutation = gql(`
  mutation UnFavorite($id: ID!) {
    unFavoritePokemon(id: $id) {
      id
      name
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
    onCompleted(data) {
      console.log(data)
      reduxStore.dispatch(
        toastsSlice.actions.add({
          title: `${
            data.unFavoritePokemon?.name || props.id
          } is not your favorite anymore.`,
          kind: "warning",
        })
      )
    },
    onError(error) {
      reduxStore.dispatch(
        toastsSlice.actions.add({
          title: `UnFavorite error: ${error.message}`,
          kind: "error",
        })
      )
    },
  })
