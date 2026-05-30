"use client";

import { useEffect, useMemo, useState } from "react";
import { pokemonForms } from "@/data/pokemonForms";
import { EditCardModal } from "@/components/EditCardModal";
import { PokedexTable } from "@/components/PokedexTable";
import { PokedexCardGrid } from "@/components/PokedexCardGrid";
import { PokedexToolbar } from "@/components/PokedexToolbar";
import { StatsCard } from "@/components/ui/StatsCard";
import { ValueCard } from "@/components/ui/ValueCard";
import { getPokemonFormsFromSupabase } from "@/lib/supabase/pokemonForms";
import { formatCurrency, normalizeText } from "@/lib/format";
import {
  downloadCollectionBackup,
  getInitialCollectionState,
  importCollectionBackup,
  loadCollectionFromStorage,
  saveCollectionToStorage,
} from "@/lib/collection";
import type {
  CollectionData,
  CollectionState,
  PokemonFormFromDatabase,
  SelectedPokemon,
} from "@/types/collection";

export function PokedexDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [formTypeFilter, setFormTypeFilter] = useState("todos");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedPokemon, setSelectedPokemon] = useState<SelectedPokemon | null>(
    null
  );

  const [databasePokemonForms, setDatabasePokemonForms] = useState<
    PokemonFormFromDatabase[]
  >([]);
  const [isLoadingPokemonForms, setIsLoadingPokemonForms] = useState(true);
  const [pokemonFormsSource, setPokemonFormsSource] = useState<
    "supabase" | "local"
  >("local");

  const [collection, setCollection] = useState<CollectionState>(() =>
    getInitialCollectionState()
  );

  useEffect(() => {
    async function loadPokemonForms() {
      try {
        const data = await getPokemonFormsFromSupabase();

        if (data.length > 0) {
          setDatabasePokemonForms(data);
          setPokemonFormsSource("supabase");
        }
      } catch (error) {
        console.error("Erro ao carregar Pokémon/Formas do Supabase:", error);
        setPokemonFormsSource("local");
      } finally {
        setIsLoadingPokemonForms(false);
      }
    }

    loadPokemonForms();
  }, []);

  useEffect(() => {
    const savedCollection = loadCollectionFromStorage();

    if (savedCollection) {
      setCollection(savedCollection);
    }
  }, []);

  useEffect(() => {
    saveCollectionToStorage(collection);
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
    downloadCollectionBackup(collection);
  }

  function importCollection(event: Parameters<typeof importCollectionBackup>[0]) {
    importCollectionBackup(event, setCollection);
  }

  function resetCollection() {
    const confirmed = window.confirm(
      "Tem certeza que deseja apagar toda a coleção? Essa ação não pode ser desfeita."
    );

    if (!confirmed) return;

    const emptyCollection = getInitialCollectionState();

    setCollection(emptyCollection);
    saveCollectionToStorage(emptyCollection);
  }

  const basePokemonForms = useMemo(() => {
    if (databasePokemonForms.length > 0) {
      return databasePokemonForms.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        formType: pokemon.form_type,
        searchName: pokemon.search_name,
        selectedCard: "",
        cardImageUrl: "",
        ligaPokemonUrl: "",
        lowestPrice: 0,
        owned: false,
      }));
    }

    return pokemonForms;
  }, [databasePokemonForms]);

  const mergedPokemonForms = useMemo(() => {
    return basePokemonForms.map((pokemon) => ({
      ...pokemon,
      ...collection[pokemon.id],
    }));
  }, [basePokemonForms, collection]);

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
    return Array.from(new Set(basePokemonForms.map((pokemon) => pokemon.formType)));
  }, [basePokemonForms]);

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
          <div className="flex flex-wrap gap-2">
            <span className="w-fit rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-sm text-yellow-300">
              Pokémon TCG Collection Tracker
            </span>

            <span className="w-fit rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1 text-sm text-zinc-400">
              Base:{" "}
              {isLoadingPokemonForms
                ? "carregando..."
                : pokemonFormsSource === "supabase"
                  ? "Supabase"
                  : "Local"}
            </span>
          </div>

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
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
            <PokedexToolbar
              search={search}
              statusFilter={statusFilter}
              formTypeFilter={formTypeFilter}
              viewMode={viewMode}
              formTypes={formTypes}
              filteredCount={filteredPokemon.length}
              totalCount={mergedPokemonForms.length}
              acquiredCards={acquiredCards}
              missingCards={missingCards}
              onSearchChange={setSearch}
              onStatusFilterChange={setStatusFilter}
              onFormTypeFilterChange={setFormTypeFilter}
              onViewModeChange={setViewMode}
              onExportCollection={exportCollection}
              onImportCollection={importCollection}
              onResetCollection={resetCollection}
            />

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