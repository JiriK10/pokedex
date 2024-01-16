"use client"

import ListItem from "./ListItem"

interface ListProps {
  ids: Array<string>
  onInfoClick?(id: string): void
}

export default function List({ ids, onInfoClick }: ListProps) {
  return (
    <div className="flex flex-col m-3">
      {ids.map((id) => (
        <ListItem key={id} id={id} onInfoClick={onInfoClick} />
      ))}
    </div>
  )
}
