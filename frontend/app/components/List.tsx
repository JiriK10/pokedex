"use client"

import classNames from "classNames"

import ListItem from "./ListItem"

interface ListProps {
  ids: Array<string>
  className?: string
  onInfoClick?(id: string): void
}

export default function List({ ids, className, onInfoClick }: ListProps) {
  return (
    <div className={classNames("flex flex-col m-3", className)}>
      {ids.map((id) => (
        <ListItem key={id} id={id} onInfoClick={onInfoClick} />
      ))}
    </div>
  )
}
