"use client";

import { useEffect, useMemo, useState } from "react";
import { pokemonForms } from "@/data/pokemonForms";

type CollectionData = {
  selectedCard: string;
  cardImageUrl: string;
  ligaPokemonUrl: string;
  lowestPrice: number;
  owned: boolean;
  notes: string;
};

type CollectionState = Record<number, CollectionData>;

type SelectedPokemon = {
  id: number;
  name: string;
  formType: string;
  searchName: string;
  selectedCard: string;
  cardImageUrl: string;
  ligaPokemonUrl: string;
  lowestPrice: number;
  owned: boolean;
  notes: string;
};

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

function getInitialCollectionState(): CollectionState {
  return pokemonForms.reduce<CollectionState>((acc, pokemon) => {
    acc[pokemon.id] = {
      selectedCard: pokemon.selectedCard,
      cardImageUrl: pokemon.cardImageUrl,
      ligaPokemonUrl: pokemon.ligaPokemonUrl,
      lowestPrice: pokemon.lowestPrice,
      owned: pokemon.owned,
      notes: "",
    };

    return acc;
  }, {});
}

export function PokedexDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [formTypeFilter, setFormTypeFilter] = useState("todos");
  const [selectedPokemon, setSelectedPokemon] = useState<SelectedPokemon | null>(
    null
  );

  const [collection, setCollection] = useState<CollectionState>(() =>
    getInitialCollectionState()
  );

  useEffect(() => {
    const savedCollection = localStorage.getItem("pokebinder-collection");

    if (savedCollection) {
      setCollection(JSON.parse(savedCollection));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pokebinder-collection", JSON.stringify(collection));
  }, [collection]);

  function updatePokemonData(
    pokemonId: number,
    field: keyof CollectionData,
    value: string | number | boolean
  ) {
    setCollection((currentCollection) => ({
      ...currentCollection,
      [pokemonId]: {
        ...currentCollection[pokemonId],
        [field]: value,
      },
    }));
  }

  function clearPokemonData(pokemonId: number) {
    setCollection((currentCollection) => ({
      ...currentCollection,
      [pokemonId]: {
        selectedCard: "",
        cardImageUrl: "",
        ligaPokemonUrl: "",
        lowestPrice: 0,
        owned: false,
        notes: "",
      },
    }));

    setSelectedPokemon(null);
  }

  const mergedPokemonForms = useMemo(() => {
    return pokemonForms.map((pokemon) => ({
      ...pokemon,
      ...collection[pokemon.id],
    }));
  }, [collection]);

  const acquiredCards = mergedPokemonForms.filter(
    (pokemon) => pokemon.owned
  ).length;

  const missingCards = mergedPokemonForms.length - acquiredCards;

  const selectedCards = mergedPokemonForms.filter(
    (pokemon) => pokemon.selectedCard.trim() !== ""
  ).length;

  const totalCollectionValue = mergedPokemonForms.reduce(
    (total, pokemon) => total + Number(pokemon.lowestPrice || 0),
    0
  );

  const acquiredCollectionValue = mergedPokemonForms.reduce((total, pokemon) => {
    if (!pokemon.owned) return total;

    return total + Number(pokemon.lowestPrice || 0);
  }, 0);

  const missingCollectionValue = totalCollectionValue - acquiredCollectionValue;

  const completionPercentage =
    mergedPokemonForms.length > 0
      ? ((acquiredCards / mergedPokemonForms.length) * 100).toFixed(2)
      : "0.00";

  const formTypes = useMemo(() => {
    return Array.from(new Set(pokemonForms.map((pokemon) => pokemon.formType)));
  }, []);

  const filteredPokemon = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return mergedPokemonForms.filter((pokemon) => {
      const matchesSearch = pokemon.searchName.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "todos" ||
        (statusFilter === "adquiridos" && pokemon.owned) ||
        (statusFilter === "faltantes" && !pokemon.owned) ||
        (statusFilter === "selecionados" &&
          pokemon.selectedCard.trim() !== "") ||
        (statusFilter === "nao-selecionados" &&
          pokemon.selectedCard.trim() === "");

      const matchesFormType =
        formTypeFilter === "todos" || pokemon.formType === formTypeFilter;

      return matchesSearch && matchesStatus && matchesFormType;
    });
  }, [search, statusFilter, formTypeFilter, mergedPokemonForms]);

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
          <StatsCard title="Total da coleção" value={mergedPokemonForms.length} />
          <StatsCard
            title="Selecionados"
            value={selectedCards}
            valueClassName="text-sky-400"
          />
          <StatsCard
            title="Adquiridos"
            value={acquiredCards}
            valueClassName="text-emerald-400"
          />
          <StatsCard
            title="Faltantes"
            value={missingCards}
            valueClassName="text-red-400"
          />
          <StatsCard
            title="Completo"
            value={`${completionPercentage}%`}
            valueClassName="text-yellow-300"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Valor estimado total"
            value={formatCurrency(totalCollectionValue)}
            valueClassName="text-yellow-300 text-2xl"
          />
          <StatsCard
            title="Valor adquirido"
            value={formatCurrency(acquiredCollectionValue)}
            valueClassName="text-emerald-400 text-2xl"
          />
          <StatsCard
            title="Valor faltante"
            value={formatCurrency(missingCollectionValue)}
            valueClassName="text-red-400 text-2xl"
          />
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="flex flex-col gap-4 border-b border-zinc-800 p-5">
            <div>
              <h2 className="text-xl font-semibold">Minha Pokédex</h2>
              <p className="text-sm text-zinc-400">
                Clique em editar para escolher a carta desejada. O check só deve
                ser marcado quando você já possuir a carta.
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead className="bg-zinc-950 text-sm text-zinc-400">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Pokémon/Forma</th>
                  <th className="px-5 py-4">Tipo</th>
                  <th className="px-5 py-4">Carta selecionada</th>
                  <th className="px-5 py-4">Preço</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredPokemon.map((pokemon) => (
                  <tr
                    key={pokemon.id}
                    className="border-t border-zinc-800 hover:bg-zinc-800/40"
                  >
                    <td className="px-5 py-4 text-zinc-400">
                      {String(pokemon.id).padStart(4, "0")}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {pokemon.cardImageUrl ? (
                          <div className="group relative">
                            <img
                              src={pokemon.cardImageUrl}
                              alt={pokemon.selectedCard || pokemon.name}
                              className="h-12 w-9 rounded object-cover"
                            />

                            <div className="pointer-events-none absolute left-0 top-14 z-20 hidden rounded-xl border border-zinc-700 bg-zinc-950 p-3 shadow-2xl group-hover:block">
                              <img
                                src={pokemon.cardImageUrl}
                                alt={pokemon.selectedCard || pokemon.name}
                                className="h-80 w-auto rounded-lg object-contain"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-12 w-9 items-center justify-center rounded border border-zinc-700 bg-zinc-950 text-xs text-zinc-500">
                            ?
                          </div>
                        )}

                        <div>
                          <p className="font-medium">{pokemon.name}</p>
                          {pokemon.notes && (
                            <p className="mt-1 max-w-xs truncate text-xs text-zinc-500">
                              {pokemon.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

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
                      {pokemon.owned ? (
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                          Adquirido
                        </span>
                      ) : pokemon.selectedCard ? (
                        <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs text-sky-300">
                          Selecionado
                        </span>
                      ) : (
                        <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
                          Pendente
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPokemon(pokemon)}
                          className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-yellow-300"
                        >
                          Editar
                        </button>

                        {pokemon.ligaPokemonUrl && (
                          <a
                            href={pokemon.ligaPokemonUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-yellow-400 hover:text-yellow-300"
                          >
                            Liga
                          </a>
                        )}
                      </div>
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

      {selectedPokemon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-800 p-5">
              <div>
                <p className="text-sm text-zinc-500">
                  Editando #{String(selectedPokemon.id).padStart(4, "0")}
                </p>
                <h3 className="text-2xl font-bold">{selectedPokemon.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {selectedPokemon.formType}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPokemon(null)}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-red-400 hover:text-red-300"
              >
                Fechar
              </button>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-[1fr_220px]">
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-400">Nome da carta</span>
                  <input
                    type="text"
                    value={collection[selectedPokemon.id]?.selectedCard || ""}
                    onChange={(event) =>
                      updatePokemonData(
                        selectedPokemon.id,
                        "selectedCard",
                        event.target.value
                      )
                    }
                    placeholder="Ex: Charizard 025/185"
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-400">
                    Link da Liga Pokémon
                  </span>
                  <input
                    type="url"
                    value={collection[selectedPokemon.id]?.ligaPokemonUrl || ""}
                    onChange={(event) =>
                      updatePokemonData(
                        selectedPokemon.id,
                        "ligaPokemonUrl",
                        event.target.value
                      )
                    }
                    placeholder="Cole o link da carta na Liga Pokémon"
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-400">URL da imagem</span>
                  <input
                    type="url"
                    value={collection[selectedPokemon.id]?.cardImageUrl || ""}
                    onChange={(event) =>
                      updatePokemonData(
                        selectedPokemon.id,
                        "cardImageUrl",
                        event.target.value
                      )
                    }
                    placeholder="Cole o endereço da imagem da carta"
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-400">Menor preço</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={collection[selectedPokemon.id]?.lowestPrice || ""}
                    onChange={(event) =>
                      updatePokemonData(
                        selectedPokemon.id,
                        "lowestPrice",
                        Number(event.target.value)
                      )
                    }
                    placeholder="0.00"
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-400">Observações</span>
                  <textarea
                    value={collection[selectedPokemon.id]?.notes || ""}
                    onChange={(event) =>
                      updatePokemonData(
                        selectedPokemon.id,
                        "notes",
                        event.target.value
                      )
                    }
                    placeholder="Ex: quero comprar essa versão em português, estado NM..."
                    rows={4}
                    className="resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <input
                    type="checkbox"
                    checked={collection[selectedPokemon.id]?.owned || false}
                    onChange={(event) =>
                      updatePokemonData(
                        selectedPokemon.id,
                        "owned",
                        event.target.checked
                      )
                    }
                    className="h-5 w-5 accent-yellow-400"
                  />
                  <span className="text-sm text-zinc-300">
                    Já possuo essa carta na coleção
                  </span>
                </label>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="mb-3 text-sm font-medium text-zinc-300">
                  Prévia da carta
                </p>

                {collection[selectedPokemon.id]?.cardImageUrl ? (
                  <img
                    src={collection[selectedPokemon.id].cardImageUrl}
                    alt={
                      collection[selectedPokemon.id].selectedCard ||
                      selectedPokemon.name
                    }
                    className="w-full rounded-xl object-contain"
                  />
                ) : (
                  <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-zinc-700 text-center text-sm text-zinc-500">
                    Cole a URL da imagem para ver a prévia.
                  </div>
                )}

                {collection[selectedPokemon.id]?.ligaPokemonUrl && (
                  <a
                    href={collection[selectedPokemon.id].ligaPokemonUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-semibold text-zinc-950 hover:bg-yellow-300"
                  >
                    Abrir na Liga Pokémon
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-800 p-5 md:flex-row md:justify-between">
              <button
                type="button"
                onClick={() => clearPokemonData(selectedPokemon.id)}
                className="rounded-xl border border-red-400/40 px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-400/10"
              >
                Limpar cadastro
              </button>

              <button
                type="button"
                onClick={() => setSelectedPokemon(null)}
                className="rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-yellow-300"
              >
                Salvar e fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

type StatsCardProps = {
  title: string;
  value: string | number;
  valueClassName?: string;
};

function StatsCard({ title, value, valueClassName = "" }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-sm text-zinc-400">{title}</p>
      <strong className={`mt-2 block text-3xl ${valueClassName}`}>
        {value}
      </strong>
    </div>
  );
}