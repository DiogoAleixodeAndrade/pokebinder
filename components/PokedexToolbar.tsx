import type { ChangeEvent } from "react";

type PokedexToolbarProps = {
  search: string;
  statusFilter: string;
  formTypeFilter: string;
  viewMode: "table" | "cards";
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
  onViewModeChange: (value: "table" | "cards") => void;
  onExportCollection: () => void;
  onImportCollection: (event: ChangeEvent<HTMLInputElement>) => void;
  onResetCollection: () => void | Promise<void>;
  onSyncCollection: () => void;
};

export function PokedexToolbar({
  search,
  statusFilter,
  formTypeFilter,
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
  onViewModeChange,
  onExportCollection,
  onImportCollection,
  onResetCollection,
  onSyncCollection,
}: PokedexToolbarProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-zinc-800 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Minha Pokédex</h2>
          <p className="text-sm text-zinc-400">
            Clique em editar para escolher a carta desejada. O check só deve ser
            marcado quando você já possuir a carta.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSyncCollection}
            disabled={isSyncing}
            className="rounded-lg border border-yellow-400/40 px-3 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSyncing ? "Sincronizando..." : "Sincronizar agora"}
          </button>

          <button
            type="button"
            onClick={onExportCollection}
            className="rounded-lg border border-emerald-400/40 px-3 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/10"
          >
            Exportar backup
          </button>

          <label className="cursor-pointer rounded-lg border border-sky-400/40 px-3 py-2 text-sm font-semibold text-sky-300 hover:bg-sky-400/10">
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
            className="rounded-lg border border-red-400/40 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-400/10"
          >
            Limpar tudo
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-500">
        Status Supabase:{" "}
        {syncStatus === "loading" && "carregando/sincronizando..."}
        {syncStatus === "success" && "conectado"}
        {syncStatus === "error" && "erro de conexão"}
        {syncStatus === "idle" && "aguardando"}
      </p>

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-zinc-300">
          Exibindo {filteredCount} de {totalCount}
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
          onChange={(event) => onSearchChange(event.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
        />

        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
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
          onChange={(event) => onFormTypeFilterChange(event.target.value)}
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
            onClick={() => onViewModeChange("table")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${viewMode === "table"
              ? "bg-yellow-400 text-zinc-950"
              : "text-zinc-400 hover:text-white"
              }`}
          >
            Tabela
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${viewMode === "cards"
              ? "bg-yellow-400 text-zinc-950"
              : "text-zinc-400 hover:text-white"
              }`}
          >
            Cards
          </button>
        </div>
      </div>
    </div>
  );
}