"use client"

import { useState } from "react"
import classNames from "classNames"
import { Loading } from "@carbon/react"
import {
  ArrowLeft as ArrowLeftIcon,
  Favorite as FavoriteIcon,
  FavoriteFilled as FavoriteFilledIcon,
  VolumeUpFilled as VolumeUpFilledIcon,
} from "@carbon/icons-react"

import {
  usePokemonDetailQuery,
  useFavoriteMutation,
  useUnFavoriteMutation,
} from "@/lib/apollo"

import PokemonsList from "./PokemonsList"

interface PokemonDetailProps {
  id: string
}

function PokemonDetailCard({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col m-3 justify-between overflow-hidden border border-solid border-stone-300 bg-stone-100">
      {children}
    </div>
  )
}

export default function PokemonDetail({ id }: PokemonDetailProps) {
  const [imgLoading, setImgLoading] = useState(true)
  const { loading: pokemonLoading, data: pokemonData } = usePokemonDetailQuery({
    id,
  })
  const [favorite, { loading: favoriteLoading }] = useFavoriteMutation({ id })
  const [unFavorite, { loading: unFavoriteLoading }] = useUnFavoriteMutation({
    id,
  })

  if (pokemonLoading) {
    return (
      <PokemonDetailCard>
        <Loading withOverlay={false} className="w-12 h-12 m-auto" />
      </PokemonDetailCard>
    )
  }

  let pokemon = pokemonData?.pokemonById
  const topIconsClass =
    "absolute w-10 h-10 left-3 sm:left-5 text-primary cursor-pointer"
  const favIconClass = "w-8 h-8 cursor-pointer"

  let audio = pokemon?.sound != null ? new Audio(pokemon.sound) : null

  return (
    <>
      <PokemonDetailCard>
        <div className="relative flex justify-center bg-white">
          {imgLoading && (
            <Loading
              withOverlay={false}
              active={!!pokemon?.image}
              className="w-12 h-12 m-auto my-16"
            />
          )}
          <img
            src={pokemon?.image}
            onLoad={() => setImgLoading(false)}
            className={classNames("max-w-full max-h-full p-3 object-contain", {
              hidden: imgLoading,
            })}
          />
          <ArrowLeftIcon
            className={classNames(topIconsClass, "top-2 sm:top-4")}
            onClick={() => history.back()}
          />
          <VolumeUpFilledIcon
            className={classNames(topIconsClass, "bottom-2 sm:bottom-4", {
              hidden: imgLoading || !audio,
            })}
            onClick={() => audio?.play()}
          />
        </div>
        <div className="flex flex-row justify-between justify-self-end p-3 pb-1">
          <div>
            <div className="text-2xl font-bold">
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
        <div className="grid grid-cols-[1fr_max-content] gap-x-3 gap-y-1 p-3 pt-0 items-center">
          <div className="h-3 bg-violet-400 rounded-full"></div>
          <div className="font-bold">CP: {pokemon?.maxCP}</div>
          <div className="h-3 bg-primary rounded-full"></div>
          <div className="font-bold">HP: {pokemon?.maxHP}</div>
        </div>
        <div className="grid grid-cols-2 border-t border-solid border-stone-300 divide-x divide-solid divide-stone-300 text-center">
          <div className="p-4">
            <div className="text-lg font-bold">Weight</div>
            {pokemon?.weight.minimum} - {pokemon?.weight.maximum}
          </div>
          <div className="p-4">
            <div className="font-bold">Height</div>
            {pokemon?.height.minimum} - {pokemon?.height.maximum}
          </div>
        </div>
      </PokemonDetailCard>
      <div className="font-bold text-xl mt-6 -mb-3 pl-3">Evolutions</div>
      <PokemonsList parentId={id} />
    </>
  )
}
