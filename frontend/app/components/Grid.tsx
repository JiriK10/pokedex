"use client"

import classNames from "classNames"

import GridItem from "./GridItem"

interface GridProps {
  ids: Array<string>
  className?: string
  onInfoClick?(id: string): void
}

export default function Grid({ ids, className, onInfoClick }: GridProps) {
  return (
    <div
      className={classNames(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 mx-3 my-4",
        className
      )}
    >
      {ids.map((id) => (
        <GridItem key={id} id={id} onInfoClick={onInfoClick} />
      ))}
    </div>
  )
}
