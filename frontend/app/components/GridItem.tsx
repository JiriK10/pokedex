"use client"

import { useState } from "react"
import Link from "next/link"
import classNames from "classNames"
import { motion } from "framer-motion"
import { Loading } from "@carbon/react"
import {
  Favorite as FavoriteIcon,
  FavoriteFilled as FavoriteFilledIcon,
  InformationFilled as InformationFilledIcon,
} from "@carbon/icons-react"

import { Pokemon } from "@/__generated__/graphql"
import { useFavoriteMutation, useUnFavoriteMutation } from "@/lib/apollo"

interface GridItemProps {
  pokemon: Pokemon
  onInfoClick?(id: string): void
}

export default function GridItem({ pokemon, onInfoClick }: GridItemProps) {
  const [imgLoading, setImgLoading] = useState(true)
  const [favorite, { loading: favoriteLoading }] = useFavoriteMutation({
    id: pokemon.id,
  })
  const [unFavorite, { loading: unFavoriteLoading }] = useUnFavoriteMutation({
    id: pokemon.id,
  })

  const actionIconClass = "w-16 h-16 p-4 rounded-full cursor-pointer"

  return (
    <Link href={`/${pokemon?.name}`} data-test="grid-item">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex flex-col w-full h-72 border border-solid border-stone-300 bg-stone-100"
      >
        <div className="flex-1 relative flex items-center w-full bg-white">
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
            className={classNames("w-full h-52 p-2 object-contain", {
              hidden: imgLoading,
            })}
          />
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="absolute top-0 right-0"
          >
            <InformationFilledIcon
              data-test="open-info"
              className={classNames(actionIconClass, "text-primary")}
              onClick={(e) => {
                e.preventDefault()
                pokemon != null &&
                  onInfoClick != null &&
                  onInfoClick(pokemon.id)
              }}
            />
          </motion.div>
        </div>
        <div className="flex items-center">
          <div className="grow p-3 pr-0 truncate">
            <div className="text-lg font-bold text-ellipsis overflow-hidden">
              {pokemon?.name ?? "Unknown"}
            </div>
            <div className="text-ellipsis overflow-hidden">
              {pokemon?.types?.join(", ")}
            </div>
          </div>
          {pokemon?.isFavorite != null && (
            <motion.div
              whileHover={{ scale: 1.2 }}
              className={classNames(
                "text-red-600",
                (favoriteLoading || unFavoriteLoading) &&
                  "pointer-events-none text-stone-500"
              )}
              onClick={(e) => e.preventDefault()}
            >
              {pokemon?.isFavorite ? (
                <FavoriteFilledIcon
                  data-test="unfavorite"
                  className={actionIconClass}
                  onClick={() => unFavorite()}
                />
              ) : (
                <FavoriteIcon
                  data-test="favorite"
                  className={actionIconClass}
                  onClick={() => favorite()}
                />
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
