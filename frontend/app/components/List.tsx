"use client"

import ListItem from "./ListItem"

interface ListProps {
  ids: Array<string>
}

export default function List({ ids }: ListProps) {
  return (
    <div className="flex flex-col m-3">
      {ids.map((id) => (
        <ListItem key={id} id={id} />
      ))}
    </div>
  )
}
