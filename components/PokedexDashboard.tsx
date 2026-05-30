"use client";

import { useEffect, useMemo, useState } from "react";
import { pokemonForms } from "@/data/pokemonForms";
import { AuthScreen } from "@/components/AuthScreen";
import { EditCardModal } from "@/components/EditCardModal";
import { PokedexCardGrid } from "@/components/PokedexCardGrid";
import { PokedexTable } from "@/components/PokedexTable";
import { PokedexToolbar } from "@/components/PokedexToolbar";
import { StatsCard } from "@/components/ui/StatsCard";
import { ValueCard } from "@/components/ui/ValueCard";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, normalizeText } from "@/lib/format";
import {
  downloadCollectionBackup,
  getInitialCollectionState,
  importCollectionBackup,
  loadCollectionFromStorage,
  saveCollectionToStorage,
} from "@/lib/collection";
import {
  deleteAllCollectionItemsFromSupabase,
  deleteCollectionItemFromSupabase,
  getCollectionItemsFromSupabase,
  saveCollectionItemsToSupabase,
} from "@/lib/supabase/collectionItems";
import { getPokemonFormsFromSupabase } from "@/lib/supabase/pokemonForms";
import type {
  CollectionData,
  CollectionState,
  PokemonFormFromDatabase,
  SelectedPokemon,
} from "@/types/collection";

export function PokedexDashboard() {
  const { user, isLoadingAuth, signOut } = useAuth();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [formTypeFilter, setFormTypeFilter] = useState("todos");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "success" | "error" | "loading"
  >("idle");
  const [hasLoadedCollection, setHasLoadedCollection] = useState(false);

  const [databasePokemonForms, setDatabasePokemonForms] = useState<
    PokemonFormFromDatabase[]
  >([]);
  const [isLoadingPokemonForms, setIsLoadingPokemonForms] = useState(true);
  const [pokemonFormsSource, setPokemonFormsSource] = useState<
    "supabase" | "local"
  >("local");

  const [selectedPokemon, setSelectedPokemon] = useState<SelectedPokemon | null>(
    null
  );

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
    async function loadCollection() {
      if (!user) {
        setHasLoadedCollection(false);
        return;
      }

      setHasLoadedCollection(false);

      try {
        setSyncStatus("loading");

        const supabaseCollection = await getCollectionItemsFromSupabase(user.id);

        if (Object.keys(supabaseCollection).length > 0) {
          const mergedCollection = {
            ...getInitialCollectionState(),
            ...supabaseCollection,
          };

          setCollection(mergedCollection);
          saveCollectionToStorage(mergedCollection);
          setSyncStatus("success");
          return;
        }

        const savedCollection = loadCollectionFromStorage();

        if (savedCollection) {
          setCollection(savedCollection);
        }

        setSyncStatus("idle");
      } catch (error) {
        console.error("Erro ao carregar coleção do Supabase:", error);

        const savedCollection = loadCollectionFromStorage();

        if (savedCollection) {
          setCollection(savedCollection);
        }

        setSyncStatus("error");
      } finally {
        setHasLoadedCollection(true);
      }
    }

    loadCollection();
  }, [user]);

  useEffect(() => {
    saveCollectionToStorage(collection);
  }, [collection]);

  useEffect(() => {
    if (!user || !hasLoadedCollection) return;

    const timeout = window.setTimeout(async () => {
      try {
        setIsSyncing(true);
        setSyncStatus("loading");

        await saveCollectionItemsToSupabase(user.id, collection);

        setSyncStatus("success");
      } catch (error) {
        console.error("Erro ao sincronizar coleção automaticamente:", error);
        setSyncStatus("error");
      } finally {
        setIsSyncing(false);
      }
    }, 1500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [collection, user, hasLoadedCollection]);

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

  async function clearPokemonData(pokemonId: number) {
    const confirmed = window.confirm(
      "Tem certeza que deseja limpar o cadastro dessa carta?"
    );

    if (!confirmed) return;

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

    if (user) {
      try {
        setIsSyncing(true);
        setSyncStatus("loading");

        await deleteCollectionItemFromSupabase(user.id, pokemonId);

        setSyncStatus("success");
      } catch (error) {
        console.error("Erro ao apagar carta do Supabase:", error);
        setSyncStatus("error");
        alert("A carta foi limpa localmente, mas não consegui apagar do Supabase.");
      } finally {
        setIsSyncing(false);
      }
    }

    setSelectedPokemon(null);
  }

  function exportCollection() {
    downloadCollectionBackup(collection);
  }

  function importCollection(event: Parameters<typeof importCollectionBackup>[0]) {
    importCollectionBackup(event, setCollection);
  }

  async function resetCollection() {
    const confirmationText = window.prompt(
      'Essa ação vai apagar toda a sua coleção. Para confirmar, digite "APAGAR".'
    );

    if (confirmationText !== "APAGAR") {
      return;
    }

    const emptyCollection = getInitialCollectionState();

    setCollection(emptyCollection);
    saveCollectionToStorage(emptyCollection);

    if (user) {
      try {
        setIsSyncing(true);
        setSyncStatus("loading");

        await deleteAllCollectionItemsFromSupabase(user.id);

        setSyncStatus("success");
      } catch (error) {
        console.error("Erro ao apagar coleção do Supabase:", error);
        setSyncStatus("error");
        alert(
          "A coleção foi limpa localmente, mas não consegui apagar tudo do Supabase."
        );
      } finally {
        setIsSyncing(false);
      }
    }
  }

  async function syncCollectionWithSupabase() {
    if (!user) {
      alert("Você precisa estar logado para sincronizar.");
      return;
    }

    try {
      setIsSyncing(true);
      setSyncStatus("loading");

      await saveCollectionItemsToSupabase(user.id, collection);

      setSyncStatus("success");
      alert("Coleção sincronizada com o Supabase!");
    } catch (error) {
      console.error("Erro ao sincronizar coleção:", error);
      setSyncStatus("error");
      alert("Erro ao sincronizar com Supabase. Veja o console.");
    } finally {
      setIsSyncing(false);
    }
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
        notes: "",
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
    return Array.from(
      new Set(basePokemonForms.map((pokemon) => pokemon.formType))
    );
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

  if (isLoadingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="premium-card rounded-2xl p-6 text-center">
          <p className="text-sm text-zinc-400">Carregando autenticação...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <main className="min-h-screen text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
        <header className="premium-card overflow-hidden rounded-[2rem]">
          <div className="relative p-6 md:p-8">
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className="w-fit rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-sm font-semibold text-yellow-300">
                    Pokémon TCG Collection Tracker
                  </span>

                  <span className="w-fit rounded-full border border-blue-400/25 bg-blue-400/10 px-4 py-1.5 text-sm text-blue-200">
                    Base:{" "}
                    {isLoadingPokemonForms
                      ? "carregando..."
                      : pokemonFormsSource === "supabase"
                        ? "Supabase"
                        : "Local"}
                  </span>

                  <span
                    className={`w-fit rounded-full border px-4 py-1.5 text-sm ${
                      syncStatus === "success"
                        ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                        : syncStatus === "error"
                          ? "border-red-400/25 bg-red-400/10 text-red-300"
                          : syncStatus === "loading"
                            ? "border-yellow-400/25 bg-yellow-400/10 text-yellow-300"
                            : "border-zinc-700 bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    {syncStatus === "loading" && "Sincronizando..."}
                    {syncStatus === "success" && "Salvo no Supabase"}
                    {syncStatus === "error" && "Erro ao salvar"}
                    {syncStatus === "idle" && "Aguardando alterações"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={signOut}
                  className="w-fit rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm font-bold text-red-200 transition hover:border-red-300 hover:bg-red-400/15"
                >
                  Sair
                </button>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-400/30 bg-yellow-400/10 text-2xl shadow-2xl shadow-yellow-950/30">
                    ⚡
                  </div>

                  <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">
                    Poké<span className="text-yellow-300">Binder</span>
                  </h1>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
                    Seu binder digital para controlar cartas Pokémon TCG por
                    Pokédex, formas regionais, mega evoluções, gigantamax e
                    variações especiais.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-400">
                    <span className="rounded-full border border-zinc-700 bg-zinc-950/60 px-4 py-2">
                      Conta: {user.email}
                    </span>

                    <span className="rounded-full border border-zinc-700 bg-zinc-950/60 px-4 py-2">
                      {mergedPokemonForms.length} formas cadastradas
                    </span>

                    <span className="rounded-full border border-zinc-700 bg-zinc-950/60 px-4 py-2">
                      {acquiredCards} adquiridas
                    </span>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950/70 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-zinc-400">Progresso geral</p>
                      <strong className="mt-1 block text-4xl font-black text-yellow-300">
                        {completionPercentage}%
                      </strong>
                    </div>

                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-sm font-bold text-yellow-300">
                      {acquiredCards}/{mergedPokemonForms.length}
                    </div>
                  </div>

                  <div className="mt-5 h-4 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
                      <p className="text-emerald-300">Adquiridos</p>
                      <strong className="mt-1 block text-xl text-white">
                        {acquiredCards}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-3">
                      <p className="text-red-300">Faltantes</p>
                      <strong className="mt-1 block text-xl text-white">
                        {missingCards}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
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

        <section className="premium-card overflow-hidden rounded-[2rem]">
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
            isSyncing={isSyncing}
            syncStatus={syncStatus}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onFormTypeFilterChange={setFormTypeFilter}
            onViewModeChange={setViewMode}
            onExportCollection={exportCollection}
            onImportCollection={importCollection}
            onResetCollection={resetCollection}
            onSyncCollection={syncCollectionWithSupabase}
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