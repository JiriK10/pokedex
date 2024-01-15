import type { Metadata } from "next"

type MetadataProps = {
  params: { name: string }
}

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  return {
    title: `Pokedex - ${params.name}`,
  }
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
