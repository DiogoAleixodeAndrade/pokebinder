import type { ChangeEvent } from "react";

type PokedexToolbarProps = {
  search: string;
  statusFilter: string;
  formTypeFilter: string;
  generationFilter: string;
  viewMode: "table" | "cards" | "binder";
  formTypes: string[];
  filteredCount: number;
  totalCount: number;
  acquiredCards: number;
  missingCards: number;
  isSyncing: boolean;
  syncStatus: "idle" | "success" | "error" | "loading";
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onFormTypeFilterChange: (value: string) => void;
  onGenerationFilterChange: (value: string) => void;
  onViewModeChange: (value: "table" | "cards" | "binder") => void;
  onExportCollection: () => void;
  onImportCollection: (event: ChangeEvent<HTMLInputElement>) => void;
  onResetCollection: () => void | Promise<void>;
  onSyncCollection: () => void;
  onOpenScanner: () => void;
};

export function PokedexToolbar({
  search,
  statusFilter,
  formTypeFilter,
  generationFilter,
  viewMode,
  formTypes,
  filteredCount,
  totalCount,
  acquiredCards,
  missingCards,
  isSyncing,
  syncStatus,
  onSearchChange,
  onStatusFilterChange,
  onFormTypeFilterChange,
  onGenerationFilterChange,
  onViewModeChange,
  onExportCollection,
  onImportCollection,
  onResetCollection,
  onSyncCollection,
  onOpenScanner,
}: PokedexToolbarProps) {
  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950/35 p-5 backdrop-blur-xl md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-400/25 bg-yellow-400/10 text-xl">
                📚
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  Minha Pokédex
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-400">
                  Escolha a carta desejada, marque como adquirida e acompanhe o
                  progresso da sua coleção em tempo real.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSyncCollection}
              disabled={isSyncing}
              className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-sm font-bold text-yellow-300 transition hover:bg-yellow-400/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSyncing ? "Sincronizando..." : "Sincronizar agora"}
            </button>

            <button
              type="button"
              onClick={onOpenScanner}
              className="rounded-2xl border border-purple-400/30 bg-purple-400/10 px-4 py-3 text-sm font-bold text-purple-300 transition hover:bg-purple-400/15"
            >
              Scanner
            </button>

            <button
              type="button"
              onClick={onExportCollection}
              className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-400/15"
            >
              Exportar backup
            </button>

            <label className="cursor-pointer rounded-2xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm font-bold text-sky-300 transition hover:bg-sky-400/15">
              Importar meus Pokémon
              <input
                type="file"
                accept=".xlsx,.xls,.csv,.txt"
                onChange={onImportCollection}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={onResetCollection}
              className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/15"
            >
              Limpar tudo
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <InfoPill
            label="Exibindo"
            value={`${filteredCount} de ${totalCount}`}
            tone="neutral"
          />

          <InfoPill
            label="Adquiridos"
            value={acquiredCards}
            tone="success"
          />

          <InfoPill label="Faltantes" value={missingCards} tone="danger" />
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              🔎
            </span>

            <input
              type="text"
              placeholder="Buscar Pokémon, forma, mega, gigantamax..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="premium-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm placeholder:text-zinc-500"
            />
          </div>

          <select
  value={statusFilter}
  onChange={(event) => onStatusFilterChange(event.target.value)}
  className="premium-input rounded-2xl px-4 py-3 text-sm"
>
  <option value="todos">Todos os status</option>
  <option value="adquiridos">Adquiridos</option>
  <option value="faltantes">Faltantes</option>
  <option value="selecionados">Com carta selecionada</option>
  <option value="nao-selecionados">Sem carta selecionada</option>
  <option value="com-media">Com média de preço</option>
  <option value="sem-media">Sem média de preço</option>
  <option value="com-imagem">Com imagem</option>
  <option value="sem-imagem">Sem imagem</option>
  <option value="com-fonte">Com fonte salva</option>
  <option value="sem-fonte">Sem fonte salva</option>
</select>

          <select
            value={formTypeFilter}
            onChange={(event) => onFormTypeFilterChange(event.target.value)}
            className="premium-input rounded-2xl px-4 py-3 text-sm"
          >
            <option value="todos">Todos os tipos</option>
            {formTypes.map((formType) => (
              <option key={formType} value={formType}>
                {formType}
              </option>
            ))}
          </select>

          <select
            value={generationFilter}
            onChange={(event) => onGenerationFilterChange(event.target.value)}
            className="premium-input rounded-2xl px-4 py-3 text-sm"
          >
            <option value="todas">Todas as gerações</option>
            <option value="1">Geração 1</option>
            <option value="2">Geração 2</option>
            <option value="3">Geração 3</option>
            <option value="4">Geração 4</option>
            <option value="5">Geração 5</option>
            <option value="6">Geração 6</option>
            <option value="7">Geração 7</option>
            <option value="8">Geração 8</option>
            <option value="9">Geração 9</option>
          </select>

          <div className="flex rounded-2xl border border-zinc-700/80 bg-zinc-950/70 p-1">
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                viewMode === "table"
                  ? "bg-yellow-400 text-zinc-950 shadow-lg shadow-yellow-950/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Tabela
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                viewMode === "cards"
                  ? "bg-yellow-400 text-zinc-950 shadow-lg shadow-yellow-950/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Cards
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange("binder")}
              className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                viewMode === "binder"
                  ? "bg-yellow-400 text-zinc-950 shadow-lg shadow-yellow-950/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Binder
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/55 px-4 py-3 text-xs text-zinc-500">
          Status:{" "}
          <span
            className={
              syncStatus === "success"
                ? "text-emerald-300"
                : syncStatus === "error"
                  ? "text-red-300"
                  : syncStatus === "loading"
                    ? "text-yellow-300"
                    : "text-zinc-400"
            }
          >
            {syncStatus === "loading" && "salvando alterações..."}
            {syncStatus === "success" && "tudo salvo no Supabase"}
            {syncStatus === "error" && "erro ao salvar no Supabase"}
            {syncStatus === "idle" && "aguardando alterações"}
          </span>
        </div>
      </div>
    </div>
  );
}

type InfoPillProps = {
  label: string;
  value: string | number;
  tone: "neutral" | "success" | "danger";
};

function InfoPill({ label, value, tone }: InfoPillProps) {
  const tones = {
    neutral: "border-zinc-700 bg-zinc-950/60 text-zinc-300",
    success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    danger: "border-red-400/25 bg-red-400/10 text-red-300",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${tones[tone]}`}>
      <p className="text-xs opacity-75">{label}</p>
      <strong className="mt-1 block text-lg font-black">{value}</strong>
    </div>
  );
}