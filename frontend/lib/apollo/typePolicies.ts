import { offsetLimitPagination } from "@apollo/client/utilities"

export const typePolicies = {
  Query: {
    fields: {
      pokemons: {
        ...offsetLimitPagination(["$search", "$type", "$favorite"]),
        merge(existing = { edges: [] }, incoming: any) {
          return { edges: [...existing.edges, ...incoming.edges] }
        },
      },
    },
  },
}
