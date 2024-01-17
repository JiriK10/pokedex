"use client"

import { Fragment } from "react"
import classNames from "classNames"
import { ComboBox, Search, SkeletonPlaceholder } from "@carbon/react"
import { Grid as GridIcon, List as ListIcon } from "@carbon/icons-react"

import {
  useDispatch,
  useSelector,
  topControlsSlice,
  TopControlsFilterType,
  TopControlsListType,
} from "@/lib/redux"
import { usePokemonTypesQuery } from "@/lib/apollo"

interface TopControlsProps {
  loading?: boolean
}

function TopControlsSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 p-3">
        {[...Array(2)].map((_, index) => (
          <SkeletonPlaceholder
            key={index}
            className="w-full h-10 border border-solid border-primary"
          />
        ))}
      </div>
      <div className="flex flex-row items-center h-10 mx-3">
        <SkeletonPlaceholder className="min-w-32 h-full grow" />
        <SkeletonPlaceholder className="w-52 h-full mx-3" />
        <SkeletonPlaceholder className="w-7 h-full mx-1" />
        <SkeletonPlaceholder className="w-7 h-full mx-1" />
      </div>
    </>
  )
}

export default function TopControls({ loading = false }: TopControlsProps) {
  const dispatch = useDispatch()
  const { filter, search, pokemonType, listType } = useSelector(
    topControlsSlice.selectors.all
  )
  const { data: pokemonTypesData } = usePokemonTypesQuery()

  const filters = {
    all: "All",
    favorite: "Favorite",
  }
  const listIcons = ["list", "grid"]
  const listIconClass = "w-8 h-8 cursor-pointer"

  if (loading) return <TopControlsSkeleton />
  return (
    <>
      <div className="grid grid-cols-2 min-w-96 p-3 cursor-pointer">
        {Object.entries(filters).map(([type, text]) => (
          <div
            key={type}
            className={classNames(
              "h-10 p-2 border border-solid text-center",
              type == filter
                ? "border-primary bg-primary text-white"
                : "border-primary bg-white text-primary"
            )}
            onClick={() =>
              dispatch(
                topControlsSlice.actions.filter(type as TopControlsFilterType)
              )
            }
          >
            {text}
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center mx-3">
        <Search
          placeholder="Search"
          labelText="Search"
          closeButtonLabelText="Clear search"
          className="min-w-32"
          autoFocus
          value={search}
          onChange={(e) =>
            dispatch(topControlsSlice.actions.search(e.target.value))
          }
        />
        <ComboBox
          id="pokemonType"
          items={pokemonTypesData?.pokemonTypes || []}
          initialSelectedItem={pokemonType}
          placeholder="Type"
          className="w-64 mx-3"
          downshiftProps={{
            id: "pokemonType",
          }}
          onChange={(item) =>
            dispatch(
              topControlsSlice.actions.pokemonType(item.selectedItem || "")
            )
          }
        />
        {listIcons.map((type) => (
          <Fragment key={type}>
            {listIcons[0] != type && (
              <div className="h-10 border-l border-solid border-stone-300 mx-1" />
            )}
            <div
              className={classNames(
                listType == type ? "text-primary" : "text-stone-400"
              )}
              onClick={() =>
                dispatch(
                  topControlsSlice.actions.listType(type as TopControlsListType)
                )
              }
            >
              {type == "list" ? (
                <ListIcon className={listIconClass} />
              ) : (
                <GridIcon className={listIconClass} />
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </>
  )
}
