"use client"

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"

export default function RootTemplate({ children }: React.PropsWithChildren) {
  const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
