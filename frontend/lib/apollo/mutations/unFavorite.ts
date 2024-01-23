import { Reference, useMutation } from "@apollo/client"

import { gql } from "__generated__/gql"
import { reduxStore, toastsSlice } from "@/lib/redux"

export const UnFavoriteMutation = gql(`
  mutation UnFavorite($id: ID!) {
    unFavoritePokemon(id: $id) {
      id
      name
      isFavorite
    }
  }    
`)

interface UnFavoriteMutationProps {
  id: string
}

export const useUnFavoriteMutation = (props: UnFavoriteMutationProps) =>
  useMutation(UnFavoriteMutation, {
    variables: props,
    update(cache) {
      cache.modify({
        fields: {
          pokemons(cached, { storeFieldName }) {
            const favoriteFilter = JSON.parse(
              storeFieldName.replace("pokemons:", "")
            ).$favorite
            if (favoriteFilter) {
              return {
                edges: cached.edges.filter(
                  (e: Reference) => e.__ref != `Pokemon:${props.id}`
                ),
              }
            }
            return cached
          },
        },
      })
      cache.evict({ fieldName: "pokemonById" })
    },
    onCompleted(data) {
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
