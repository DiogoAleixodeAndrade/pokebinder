import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokéBinder | Pokémon TCG Collection Tracker",
  description:
    "Controle sua coleção Pokémon TCG por Pokédex, formas regionais, mega evoluções, gigantamax, progresso e valores.",
  appleWebApp: {
    capable: true,
    title: "PokéBinder",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}