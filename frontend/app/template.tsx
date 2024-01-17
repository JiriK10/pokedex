"use client"

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"

import { typePolicies } from "@/lib/apollo"

export default function RootTemplate({ children }: React.PropsWithChildren) {
  const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache({ typePolicies }),
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
