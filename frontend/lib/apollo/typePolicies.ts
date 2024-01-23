import { offsetLimitPagination, Reference } from "@apollo/client/utilities"

interface PokemonsMerge {
  edges: Array<Reference>
}

export const typePolicies = {
  Query: {
    fields: {
      pokemons: {
        ...offsetLimitPagination(["$search", "$type", "$favorite"]),
        merge(
          existing: PokemonsMerge = { edges: [] },
          incoming: PokemonsMerge
        ) {
          let edges = existing.edges.filter(
            (e) => !incoming.edges.some((i) => i.__ref == e.__ref)
          )
          edges = [...edges, ...incoming.edges]
          edges.sort((a, b) => a.__ref.localeCompare(b.__ref))
          return { edges }
        },
      },
    },
  },
}
