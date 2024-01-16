"use client"

import { useState } from "react"
import Link from "next/link"
import classNames from "classNames"
import { Loading } from "@carbon/react"
import {
  Favorite as FavoriteIcon,
  FavoriteFilled as FavoriteFilledIcon,
  InformationFilled as InformationFilledIcon,
} from "@carbon/icons-react"

import {
  usePokemonQuery,
  useFavoriteMutation,
  useUnFavoriteMutation,
} from "@/lib/apollo"

interface ListItemProps {
  id: string
  onInfoClick?(id: string): void
}

function ListItemCard({ children }: React.PropsWithChildren) {
  return (
    <div className="flex items-center w-full h-20 my-1 border border-solid border-stone-300 bg-stone-100">
      {children}
    </div>
  )
}

export default function ListItem({ id, onInfoClick }: ListItemProps) {
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

  const pokemon = pokemonData?.pokemonById
  const actionIconClass = "w-16 h-16 p-4 rounded-full cursor-pointer"

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
        <div className="flex flex-col grow p-4 pr-0">
          <div className="text-lg font-bold">{pokemon?.name ?? "Unknown"}</div>
          <div>{pokemon?.types?.join(", ")}</div>
        </div>
        <InformationFilledIcon
          className={classNames(actionIconClass, "text-primary")}
          onClick={(e) => {
            e.preventDefault()
            pokemon != null && onInfoClick != null && onInfoClick(pokemon.id)
          }}
        />
        {pokemon?.isFavorite != null && (
          <div
            className={classNames(
              "text-red-600",
              (favoriteLoading || unFavoriteLoading) &&
                "pointer-events-none text-stone-500"
            )}
            onClick={(e) => e.preventDefault()}
          >
            {pokemon?.isFavorite ? (
              <FavoriteFilledIcon
                className={actionIconClass}
                onClick={() => unFavorite()}
              />
            ) : (
              <FavoriteIcon
                className={actionIconClass}
                onClick={() => favorite()}
              />
            )}
          </div>
        )}
      </ListItemCard>
    </Link>
  )
}
