import { useMutation } from "@apollo/client"

import { gql } from "__generated__/gql"
import { reduxStore, toastsSlice } from "@/lib/redux"

import { PokemonQuery } from "../queries/pokemon"

export const FavoriteMutation = gql(`
  mutation Favorite($id: ID!) {
    favoritePokemon(id: $id) {
      id
      name
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
    onCompleted(data) {
      console.log(data)
      reduxStore.dispatch(
        toastsSlice.actions.add({
          title: `${
            data.favoritePokemon?.name || props.id
          } is now your favorite!`,
        })
      )
    },
    onError(error) {
      reduxStore.dispatch(
        toastsSlice.actions.add({
          title: `Favorite error: ${error.message}`,
          kind: "error",
        })
      )
    },
  })
