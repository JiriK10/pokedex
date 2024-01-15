"use client"

import { useState } from "react"
import Link from "next/link"
import classNames from "classNames"
import { Loading } from "@carbon/react"
import {
  Favorite as FavoriteIcon,
  FavoriteFilled as FavoriteFilledIcon,
} from "@carbon/icons-react"

import {
  usePokemonQuery,
  useFavoriteMutation,
  useUnFavoriteMutation,
} from "@/lib/apollo"

interface ListItemProps {
  id: string
}

function ListItemCard({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-row w-full h-20 my-1 justify-between overflow-hidden border border-solid border-stone-300 bg-stone-100">
      {children}
    </div>
  )
}

export default function ListItem({ id }: ListItemProps) {
  const [imgLoading, setImgLoading] = useState(true)
  const { loading: pokemonLoading, data: pokemonData } = usePokemonQuery({ id })
  const [favorite, { loading: favoriteLoading }] = useFavoriteMutation({ id })
  const [unFavorite, { loading: unFavoriteLoading }] = useUnFavoriteMutation({
    id,
  })

  if (pokemonLoading) {
    return (
      <ListItemCard>
        <Loading withOverlay={false} className="w-12 h-12 m-auto" />
      </ListItemCard>
    )
  }

  let pokemon = pokemonData?.pokemonById
  const favIconClass = "w-8 h-8 cursor-pointer"

  return (
    <Link href={`/${pokemon?.name}`}>
      <ListItemCard>
        <div className="flex items-center w-20 h-full bg-white">
          {imgLoading && (
            <Loading
              withOverlay={false}
              active={!!pokemon?.image}
              className="w-8 h-8 m-auto"
            />
          )}
          <img
            src={pokemon?.image}
            onLoad={() => setImgLoading(false)}
            className={classNames("w-20 h-full p-1 object-contain", {
              hidden: imgLoading,
            })}
          />
        </div>
        <div className="flex flex-row grow justify-between p-4">
          <div>
            <div className="text-lg font-bold">
              {pokemon?.name ?? "Unknown"}
            </div>
            <div>{pokemon?.types?.join(", ")}</div>
          </div>
          {pokemon?.isFavorite != null && (
            <div
              className={classNames(
                "flex flex-row items-center pl-4 text-red-600 cursor-default",
                (favoriteLoading || unFavoriteLoading) &&
                  "pointer-events-none text-stone-500"
              )}
              onClick={(e) => e.preventDefault()}
            >
              {pokemon?.isFavorite ? (
                <FavoriteFilledIcon
                  className={favIconClass}
                  onClick={() => unFavorite()}
                />
              ) : (
                <FavoriteIcon
                  className={favIconClass}
                  onClick={() => favorite()}
                />
              )}
            </div>
          )}
        </div>
      </ListItemCard>
    </Link>
  )
}
