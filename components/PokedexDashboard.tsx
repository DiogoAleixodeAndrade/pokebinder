"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { pokemonForms } from "@/data/pokemonForms";
import { EditCardModal } from "@/components/EditCardModal";
import { StatsCard } from "@/components/ui/StatsCard";
import { ValueCard } from "@/components/ui/ValueCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PokedexTable } from "@/components/PokedexTable";
import { PokedexCardGrid } from "@/components/PokedexCardGrid";
import type { CollectionData, CollectionState, SelectedPokemon, } from "@/types/collection";

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
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
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

  function exportCollection() {
    const backup = {
      exportedAt: new Date().toISOString(),
      app: "PokéBinder",
      version: 1,
      collection,
    };

    const file = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = `pokebinder-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  function importCollection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const result = reader.result;

        if (typeof result !== "string") {
          alert("Não consegui ler esse arquivo.");
          return;
        }

        const parsedBackup = JSON.parse(result);

        if (!parsedBackup.collection) {
          alert("Esse arquivo não parece ser um backup válido do PokéBinder.");
          return;
        }

        setCollection(parsedBackup.collection);
        alert("Backup importado com sucesso!");
      } catch {
        alert(
          "Erro ao importar backup. Verifique se o arquivo é um JSON válido."
        );
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  function resetCollection() {
    const confirmed = window.confirm(
      "Tem certeza que deseja apagar toda a coleção? Essa ação não pode ser desfeita."
    );

    if (!confirmed) return;

    const emptyCollection = getInitialCollectionState();

    setCollection(emptyCollection);
    localStorage.setItem("pokebinder-collection", JSON.stringify(emptyCollection));
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
      ? Number(((acquiredCards / mergedPokemonForms.length) * 100).toFixed(2))
      : 0;

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

        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 shadow-2xl shadow-yellow-950/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">Progresso da coleção</p>
                <strong className="mt-2 block text-4xl text-yellow-300">
                  {completionPercentage}%
                </strong>
              </div>

              <div className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                PokéBinder
              </div>
            </div>

            <div className="mt-5 h-4 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-zinc-500">
              <span>{acquiredCards} adquiridos</span>
              <span>{mergedPokemonForms.length} total</span>
            </div>
          </div>

          <StatsCard title="Total da coleção" value={mergedPokemonForms.length} />

          <StatsCard
            title="Selecionados"
            value={selectedCards}
            valueClassName="text-sky-400"
          />

          <StatsCard
            title="Faltantes"
            value={missingCards}
            valueClassName="text-red-400"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <ValueCard
            title="Valor estimado total"
            description="Soma dos menores preços cadastrados"
            value={formatCurrency(totalCollectionValue)}
            valueClassName="text-yellow-300"
          />

          <ValueCard
            title="Valor adquirido"
            description="Valor aproximado do que você já possui"
            value={formatCurrency(acquiredCollectionValue)}
            valueClassName="text-emerald-400"
          />

          <ValueCard
            title="Valor faltante"
            description="Estimativa do que ainda falta comprar"
            value={formatCurrency(missingCollectionValue)}
            valueClassName="text-red-400"
          />
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="flex flex-col gap-4 border-b border-zinc-800 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Minha Pokédex</h2>
                <p className="text-sm text-zinc-400">
                  Clique em editar para escolher a carta desejada. O check só
                  deve ser marcado quando você já possuir a carta.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportCollection}
                  className="rounded-lg border border-emerald-400/40 px-3 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/10"
                >
                  Exportar backup
                </button>

                <label className="cursor-pointer rounded-lg border border-sky-400/40 px-3 py-2 text-sm font-semibold text-sky-300 hover:bg-sky-400/10">
                  Importar backup
                  <input
                    type="file"
                    accept="application/json"
                    onChange={importCollection}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={resetCollection}
                  className="rounded-lg border border-red-400/40 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-400/10"
                >
                  Limpar tudo
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-zinc-300">
                Exibindo {filteredPokemon.length} de {mergedPokemonForms.length}
              </span>

              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-300">
                {acquiredCards} adquiridos
              </span>

              <span className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1 text-red-300">
                {missingCards} faltantes
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
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

              <div className="flex rounded-xl border border-zinc-700 bg-zinc-950 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    viewMode === "table"
                      ? "bg-yellow-400 text-zinc-950"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Tabela
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    viewMode === "cards"
                      ? "bg-yellow-400 text-zinc-950"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>

        {viewMode === "table" && (
  <PokedexTable
    pokemonList={filteredPokemon}
    onEdit={setSelectedPokemon}
    formatCurrency={formatCurrency}
  />
)}

{viewMode === "cards" && (
  <PokedexCardGrid
    pokemonList={filteredPokemon}
    onEdit={setSelectedPokemon}
    formatCurrency={formatCurrency}
  />
)}
        </section>
      </section>

      {selectedPokemon && (
  <EditCardModal
    selectedPokemon={selectedPokemon}
    collection={collection}
    onClose={() => setSelectedPokemon(null)}
    onClear={clearPokemonData}
    onUpdate={updatePokemonData}
  />
)}
    </main>
  );
}