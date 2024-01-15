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

interface GridItemProps {
  id: string
}

function GridItemCard({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col w-full h-72 justify-between overflow-hidden border border-solid border-stone-300">
      {children}
    </div>
  )
}

export default function GridItem({ id }: GridItemProps) {
  const [imgLoading, setImgLoading] = useState(true)
  const { loading: pokemonLoading, data: pokemonData } = usePokemonQuery({ id })
  const [favorite, { loading: favoriteLoading }] = useFavoriteMutation({ id })
  const [unFavorite, { loading: unFavoriteLoading }] = useUnFavoriteMutation({
    id,
  })

  if (pokemonLoading) {
    return (
      <GridItemCard>
        <Loading withOverlay={false} className="w-12 h-12 m-auto" />
      </GridItemCard>
    )
  }

  let pokemon = pokemonData?.pokemonById
  const favIconClass = "w-8 h-8 cursor-pointer"

  return (
    <Link href={`/${pokemon?.name}`}>
      <GridItemCard>
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
          className={classNames("w-full h-48 p-4 grow object-contain", {
            hidden: imgLoading,
          })}
        />
        <div className="flex flex-row justify-between justify-self-end bg-stone-100 p-3">
          <div>
            <div className="text-lg font-bold">
              {pokemon?.name ?? "Unknown"}
            </div>
            <div>{pokemon?.types?.join(", ")}</div>
          </div>
          {pokemon?.isFavorite != null && (
            <div
              className={classNames(
                "flex flex-row items-center pl-3 text-red-600 cursor-default",
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
      </GridItemCard>
    </Link>
  )
}
