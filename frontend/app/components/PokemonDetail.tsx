"use client"

import { useState } from "react"
import classNames from "classNames"
import { Loading, Modal } from "@carbon/react"
import {
  ArrowLeft as ArrowLeftIcon,
  Favorite as FavoriteIcon,
  FavoriteFilled as FavoriteFilledIcon,
  InformationFilled as InformationFilledIcon,
  VolumeUpFilled as VolumeUpFilledIcon,
} from "@carbon/icons-react"

import {
  usePokemonDetailQuery,
  useFavoriteMutation,
  useUnFavoriteMutation,
} from "@/lib/apollo"

import PokemonsList from "./PokemonsList"
import PokemonInfo from "./PokemonInfo"

interface PokemonDetailProps {
  id: string
}

function PokemonDetailCard({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col m-3 border border-solid border-stone-300 bg-stone-100">
      {children}
    </div>
  )
}

export default function PokemonDetail({ id }: PokemonDetailProps) {
  const [imgLoading, setImgLoading] = useState(true)
  const [infoOpen, setInfoOpen] = useState(false)
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
        <Loading withOverlay={false} className="w-12 h-12 mx-auto my-20" />
      </PokemonDetailCard>
    )
  }

  const pokemon = pokemonData?.pokemonById
  if (pokemon == null) return null

  const topIconsClass = "absolute w-20 h-20 p-5 text-primary cursor-pointer"
  const actionIconClass = "w-16 h-16 p-4 rounded-full cursor-pointer"

  const audio = pokemon?.sound != null ? new Audio(pokemon.sound) : null

  return (
    <>
      <PokemonDetailCard>
        <div className="relative flex justify-center bg-white">
          {imgLoading && (
            <Loading
              withOverlay={false}
              active={!!pokemon.image}
              className="w-12 h-12 m-auto my-16"
            />
          )}
          <img
            src={pokemon.image}
            onLoad={() => setImgLoading(false)}
            className={classNames("max-w-full max-h-full p-3 object-contain", {
              hidden: imgLoading,
            })}
          />
          <ArrowLeftIcon
            className={classNames(topIconsClass, "left-0 top-0")}
            onClick={() => history.back()}
          />
          <VolumeUpFilledIcon
            className={classNames(topIconsClass, "left-0 bottom-0", {
              hidden: imgLoading || !audio,
            })}
            onClick={() => audio?.play()}
          />
          <InformationFilledIcon
            className={classNames(topIconsClass, "right-0 top-0")}
            onClick={() => setInfoOpen(true)}
          />
        </div>
        <div className="flex items-center">
          <div className="grow p-3 pr-0 pb-1">
            <h1 className="text-2xl font-bold">{pokemon.name}</h1>
            <div>{pokemon.types.join(", ")}</div>
          </div>
          <div
            className={classNames(
              "text-red-600",
              (favoriteLoading || unFavoriteLoading) &&
                "pointer-events-none text-stone-500"
            )}
            onClick={(e) => e.preventDefault()}
          >
            {pokemon.isFavorite ? (
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
        </div>
        <div className="grid grid-cols-[1fr_max-content] gap-x-3 gap-y-1 p-3 pt-0 items-center">
          <div className="h-3 bg-violet-400 rounded-full"></div>
          <div className="font-bold">CP: {pokemon.maxCP}</div>
          <div className="h-3 bg-primary rounded-full"></div>
          <div className="font-bold">HP: {pokemon.maxHP}</div>
        </div>
        <div className="grid grid-cols-2 border-t border-solid border-stone-300 divide-x divide-solid divide-stone-300 text-center">
          <div className="p-4">
            <div className="text-lg font-bold">Weight</div>
            {pokemon.weight.minimum} - {pokemon.weight.maximum}
          </div>
          <div className="p-4">
            <div className="font-bold">Height</div>
            {pokemon.height.minimum} - {pokemon.height.maximum}
          </div>
        </div>
      </PokemonDetailCard>
      <PokemonsList parentId={id} showControls={false} caption="Evolutions" />
      <Modal
        modalHeading={pokemon.name}
        passiveModal
        open={infoOpen}
        onRequestClose={() => setInfoOpen(false)}
      >
        <PokemonInfo id={pokemon?.id} />
      </Modal>
    </>
  )
}
