"use client";

import { useMemo, useState } from "react";
import { pokemonForms } from "@/data/pokemonForms";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function PokedexDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [formTypeFilter, setFormTypeFilter] = useState("todos");

  const acquiredCards = pokemonForms.filter((pokemon) => pokemon.owned).length;
  const missingCards = pokemonForms.length - acquiredCards;
  const selectedCards = pokemonForms.filter(
    (pokemon) => pokemon.selectedCard.trim() !== ""
  ).length;

  const totalCollectionValue = pokemonForms.reduce(
    (total, pokemon) => total + pokemon.lowestPrice,
    0
  );

  const completionPercentage =
    pokemonForms.length > 0
      ? ((acquiredCards / pokemonForms.length) * 100).toFixed(2)
      : "0.00";

  const formTypes = useMemo(() => {
    return Array.from(new Set(pokemonForms.map((pokemon) => pokemon.formType)));
  }, []);

  const filteredPokemon = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return pokemonForms.filter((pokemon) => {
      const matchesSearch = pokemon.searchName.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "todos" ||
        (statusFilter === "adquiridos" && pokemon.owned) ||
        (statusFilter === "faltantes" && !pokemon.owned) ||
        (statusFilter === "selecionados" && pokemon.selectedCard.trim() !== "") ||
        (statusFilter === "nao-selecionados" &&
          pokemon.selectedCard.trim() === "");

      const matchesFormType =
        formTypeFilter === "todos" || pokemon.formType === formTypeFilter;

      return matchesSearch && matchesStatus && matchesFormType;
    });
  }, [search, statusFilter, formTypeFilter]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
        <div className="flex flex-col gap-3">
          <span className="w-fit rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-sm text-yellow-300">
            Pokémon TCG Collection Tracker
          </span>

          <div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              PokéBinder
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Controle sua coleção de cartas Pokémon por Pokédex, formas
              regionais, mega evoluções, gigantamax e variações especiais.
            </p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Total da coleção</p>
            <strong className="mt-2 block text-3xl">
              {pokemonForms.length}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Selecionados</p>
            <strong className="mt-2 block text-3xl text-sky-400">
              {selectedCards}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Adquiridos</p>
            <strong className="mt-2 block text-3xl text-emerald-400">
              {acquiredCards}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Faltantes</p>
            <strong className="mt-2 block text-3xl text-red-400">
              {missingCards}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Completo</p>
            <strong className="mt-2 block text-3xl text-yellow-300">
              {completionPercentage}%
            </strong>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="flex flex-col gap-4 border-b border-zinc-800 p-5">
            <div>
              <h2 className="text-xl font-semibold">Minha Pokédex</h2>
              <p className="text-sm text-zinc-400">
                Selecione a carta desejada e marque check apenas quando você já
                possuir a carta.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <input
                type="text"
                placeholder="Buscar Pokémon..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-yellow-400"
              >
                <option value="todos">Todos os status</option>
                <option value="adquiridos">Adquiridos</option>
                <option value="faltantes">Faltantes</option>
                <option value="selecionados">Com carta selecionada</option>
                <option value="nao-selecionados">Sem carta selecionada</option>
              </select>

              <select
                value={formTypeFilter}
                onChange={(event) => setFormTypeFilter(event.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-yellow-400"
              >
                <option value="todos">Todos os tipos</option>
                {formTypes.map((formType) => (
                  <option key={formType} value={formType}>
                    {formType}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-sm text-zinc-400">Valor estimado da coleção</p>
              <strong className="mt-1 block text-2xl text-yellow-300">
                {formatCurrency(totalCollectionValue)}
              </strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="bg-zinc-950 text-sm text-zinc-400">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Pokémon/Forma</th>
                  <th className="px-5 py-4">Tipo</th>
                  <th className="px-5 py-4">Carta selecionada</th>
                  <th className="px-5 py-4">Menor preço</th>
                  <th className="px-5 py-4">Check</th>
                </tr>
              </thead>

              <tbody>
                {filteredPokemon.map((pokemon) => (
                  <tr key={pokemon.id} className="border-t border-zinc-800">
                    <td className="px-5 py-4 text-zinc-400">
                      {String(pokemon.id).padStart(4, "0")}
                    </td>

                    <td className="px-5 py-4 font-medium">{pokemon.name}</td>

                    <td className="px-5 py-4">
                      <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
                        {pokemon.formType}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-zinc-300">
                      {pokemon.selectedCard || "Ainda não selecionado"}
                    </td>

                    <td className="px-5 py-4 text-zinc-300">
                      {pokemon.lowestPrice > 0
                        ? formatCurrency(pokemon.lowestPrice)
                        : "-"}
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={pokemon.owned}
                        readOnly
                        className="h-5 w-5 accent-yellow-400"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPokemon.length === 0 && (
              <div className="p-8 text-center text-zinc-400">
                Nenhum Pokémon encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}