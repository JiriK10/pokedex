import { Reference, useMutation } from "@apollo/client"

import { gql } from "__generated__/gql"
import { reduxStore, toastsSlice } from "@/lib/redux"

export const FavoriteMutation = gql(`
  mutation Favorite($id: ID!) {
    favoritePokemon(id: $id) {
      id
      name
      isFavorite
    }
  }    
`)

interface FavoriteMutationProps {
  id: string
}

export const useFavoriteMutation = (props: FavoriteMutationProps) =>
  useMutation(FavoriteMutation, {
    variables: props,
    update(cache) {
      cache.modify({
        fields: {
          pokemons(cached, { DELETE, storeFieldName }) {
            const favoriteFilter = JSON.parse(
              storeFieldName.replace("pokemons:", "")
            ).$favorite
            return favoriteFilter ? DELETE : cached
          },
        },
      })
      cache.evict({ fieldName: "pokemonById" })
    },
    onCompleted(data) {
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
