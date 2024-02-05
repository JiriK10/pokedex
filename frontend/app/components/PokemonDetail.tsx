"use client"

import { useState } from "react"
import classNames from "classNames"
import { motion } from "framer-motion"
import { Loading, Modal } from "@carbon/react"
import {
  ArrowLeft as ArrowLeftIcon,
  Favorite as FavoriteIcon,
  FavoriteFilled as FavoriteFilledIcon,
  InformationFilled as InformationFilledIcon,
  VolumeUpFilled as VolumeUpFilledIcon,
} from "@carbon/icons-react"

import { Pokemon } from "@/__generated__/graphql"
import { useFavoriteMutation, useUnFavoriteMutation } from "@/lib/apollo"

import PokemonsList from "./PokemonsList"
import PokemonInfo from "./PokemonInfo"

interface PokemonDetailProps {
  pokemon: Pokemon
  loading: boolean
}

interface PokemonDetailCardProps extends React.PropsWithChildren {
  dataTest?: string
}

function PokemonDetailCard({ children, dataTest }: PokemonDetailCardProps) {
  return (
    <div
      className="flex flex-col m-3 border border-solid border-stone-300 bg-stone-100"
      data-test={dataTest}
    >
      {children}
    </div>
  )
}

export default function PokemonDetail({
  pokemon,
  loading,
}: PokemonDetailProps) {
  if (loading) {
    return (
      <PokemonDetailCard dataTest="loading">
        <Loading withOverlay={false} className="w-12 h-12 mx-auto my-20" />
      </PokemonDetailCard>
    )
  }
  if (pokemon == null) return null

  const [imgLoading, setImgLoading] = useState(true)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [favorite, { loading: favoriteLoading }] = useFavoriteMutation({
    id: pokemon.id,
  })
  const [unFavorite, { loading: unFavoriteLoading }] = useUnFavoriteMutation({
    id: pokemon.id,
  })

  const topIconsClass = "w-20 h-20 p-5 text-primary cursor-pointer"
  const actionIconClass = "w-16 h-16 p-4 rounded-full cursor-pointer"

  const audio = pokemon.sound != null ? new Audio(pokemon.sound) : null
  if (audio) {
    audio.onplay = () => setAudioPlaying(true)
    audio.onpause = () => setAudioPlaying(false)
  }

  return (
    <>
      <PokemonDetailCard dataTest="pokemon-detail">
        <div className="relative flex justify-center bg-white">
          {imgLoading && (
            <Loading
              data-test="image-loading"
              withOverlay={false}
              active={!!pokemon.image}
              className="w-12 h-12 m-auto my-16"
            />
          )}
          <img
            data-test="image"
            src={pokemon.image}
            onLoad={() => setImgLoading(false)}
            className={classNames("max-w-full max-h-full p-3 object-contain", {
              hidden: imgLoading,
            })}
          />
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="absolute left-0 top-0"
          >
            <ArrowLeftIcon
              data-test="back"
              className={topIconsClass}
              onClick={() => history.back()}
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="absolute left-0 bottom-0"
          >
            <VolumeUpFilledIcon
              data-test="play-sound"
              className={classNames(
                topIconsClass,
                audioPlaying ? "playing" : "paused",
                {
                  hidden: imgLoading || !audio,
                }
              )}
              onClick={() => audio?.play()}
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="absolute right-0 top-0"
          >
            <InformationFilledIcon
              data-test="open-info"
              className={topIconsClass}
              onClick={() => setInfoOpen(true)}
            />
          </motion.div>
        </div>
        <div className="flex items-center">
          <div className="grow p-3 pr-0 pb-1">
            <h1 className="text-2xl font-bold">{pokemon.name}</h1>
            <div data-test="pokemon-types">{pokemon.types.join(", ")}</div>
          </div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            className={classNames(
              "text-red-600",
              (favoriteLoading || unFavoriteLoading) &&
                "pointer-events-none text-stone-500"
            )}
            onClick={(e) => e.preventDefault()}
          >
            {pokemon.isFavorite ? (
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
        </div>
        <div className="grid grid-cols-[1fr_max-content] gap-x-3 gap-y-1 p-3 pt-0 items-center">
          <div className="h-3 bg-violet-400 rounded-full"></div>
          <div data-test="pokemon-max-cp" className="font-bold">
            CP: {pokemon.maxCP}
          </div>
          <div className="h-3 bg-primary rounded-full"></div>
          <div data-test="pokemon-max-hp" className="font-bold">
            HP: {pokemon.maxHP}
          </div>
        </div>
        <div className="grid grid-cols-2 border-t border-solid border-stone-300 divide-x divide-solid divide-stone-300 text-center">
          <div className="p-4">
            <div className="text-lg font-bold">Weight</div>
            <div data-test="pokemon-weight">
              {pokemon.weight.minimum} - {pokemon.weight.maximum}
            </div>
          </div>
          <div className="p-4">
            <div className="font-bold">Height</div>
            <div data-test="pokemon-height">
              {pokemon.height.minimum} - {pokemon.height.maximum}
            </div>
          </div>
        </div>
      </PokemonDetailCard>
      <PokemonsList
        dataTest="pokemon-evolutions"
        parentId={pokemon.id}
        showControls={false}
        caption="Evolutions"
      />
      {infoOpen && (
        <Modal
          data-test="pokemon-info"
          modalHeading={pokemon.name}
          passiveModal
          open
          onRequestClose={() => setInfoOpen(false)}
        >
          <PokemonInfo id={pokemon.id} />
        </Modal>
      )}
    </>
  )
}
