import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PokéBinder",
    short_name: "PokéBinder",
    description:
      "Controle premium de coleção Pokémon TCG por Pokédex, formas regionais, mega evoluções e gigantamax.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#facc15",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}