# PokéBinder

**PokéBinder** é uma aplicação web para controle de coleção Pokémon TCG, criada para colecionadores acompanharem quais Pokémon/Formas já possuem, quais ainda faltam, o progresso da coleção e o valor estimado com base nas cartas cadastradas.

O projeto foi desenvolvido com foco em uma experiência moderna, visual premium e possibilidade de futuramente evoluir para um app completo.

## Preview

Adicione aqui prints do projeto: (Ainda vou adicionar)

```md
![Tela inicial](./public/preview-dashboard.png)
![Tela de login](./public/preview-login.png)
![Cards da coleção](./public/preview-cards.png)
```

## Funcionalidades

* Login com Google usando Supabase Auth
* Login e cadastro com e-mail e senha
* Controle individual por usuário
* Lista completa de Pokémon/Formas
* Suporte para:

  * Pokémon padrão
  * Formas regionais
  * Mega Evoluções
  * Gigantamax
  * Formas especiais
* Visualização em tabela
* Visualização em cards
* Busca por nome
* Filtro por status
* Filtro por tipo de forma
* Marcar carta como adquirida
* Cadastrar nome da carta
* Cadastrar link da Liga Pokémon
* Cadastrar imagem da carta
* Cadastrar menor preço
* Cadastrar observações
* Preview da carta ao passar o mouse
* Contador de cartas adquiridas
* Contador de cartas faltantes
* Porcentagem completa da coleção
* Valor estimado total da coleção
* Valor estimado adquirido
* Valor estimado faltante
* Importação de Pokémon adquiridos por planilha
* Suporte para arquivos `.xlsx`, `.xls`, `.csv` e `.txt`
* Sincronização automática com Supabase
* Backup da coleção
* Layout responsivo
* Interface premium em dark mode

## Tecnologias utilizadas

* Next.js
* React
* TypeScript
* Tailwind CSS
* Supabase
* Supabase Auth
* Supabase PostgreSQL
* Vercel
* XLSX

## Objetivo do projeto

O objetivo do PokéBinder é resolver um problema real de colecionadores: controlar de forma simples, visual e organizada uma coleção Pokémon TCG baseada em cada Pokémon/Forma existente.

Em vez de controlar apenas cartas soltas, o sistema permite acompanhar uma meta específica: possuir pelo menos uma carta de cada Pokémon, incluindo formas regionais, mega evoluções, gigantamax e variações especiais.

## Como funciona

Cada Pokémon/Forma possui um cadastro individual dentro da coleção. O usuário pode escolher uma carta específica para representar aquele Pokémon, informar preço, imagem, link da Liga Pokémon e marcar se já possui ou não a carta.

A coleção é salva no Supabase e vinculada ao usuário autenticado. Assim, cada usuário possui sua própria coleção privada.

## Importação por planilha

O sistema permite importar uma lista de Pokémon já adquiridos. A planilha não precisa conter a carta específica. Basta ter os nomes dos Pokémon/Formas.

Ao importar, o sistema:

* Lê os nomes da planilha
* Compara com a base da Pokédex
* Marca os Pokémon encontrados como adquiridos
* Define a carta como "Carta não especificada"
* Adiciona a observação "Importado da planilha"
* Mostra quantos foram encontrados, ignorados ou não reconhecidos

## Estrutura do projeto

```txt
pokebinder/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AuthScreen.tsx
│   ├── EditCardModal.tsx
│   ├── PokedexCardGrid.tsx
│   ├── PokedexDashboard.tsx
│   ├── PokedexTable.tsx
│   ├── PokedexToolbar.tsx
│   └── ui/
│       ├── StatsCard.tsx
│       ├── StatusBadge.tsx
│       └── ValueCard.tsx
├── context/
│   └── AuthContext.tsx
├── data/
│   ├── rawPokemonForms.txt
│   └── pokemonForms.ts
├── lib/
│   ├── collection.ts
│   ├── format.ts
│   ├── importOwnedPokemon.ts
│   └── supabase/
│       ├── client.ts
│       ├── collectionItems.ts
│       └── pokemonForms.ts
├── scripts/
│   ├── generate-pokemon-forms.mjs
│   └── seed-pokemon-forms.mjs
├── types/
│   └── collection.ts
└── README.md
```

## Como rodar localmente

Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/pokebinder.git
```

Entre na pasta:

```bash
cd pokebinder
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

Rode o projeto:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

## Scripts úteis

Gerar a base local da Pokédex:

```bash
node scripts/generate-pokemon-forms.mjs
```

Enviar a base para o Supabase:

```bash
node scripts/seed-pokemon-forms.mjs
```

Build de produção:

```bash
npm run build
```

## Configuração do Supabase

O projeto utiliza as seguintes tabelas:

### `pokemon_forms`

Armazena a base de Pokémon/Formas.

Campos principais:

* `id`
* `name`
* `form_type`
* `search_name`

### `collection_items`

Armazena a coleção individual de cada usuário.

Campos principais:

* `id`
* `user_id`
* `pokemon_form_id`
* `selected_card`
* `card_image_url`
* `liga_pokemon_url`
* `lowest_price`
* `owned`
* `notes`
* `created_at`
* `updated_at`

## Segurança

O projeto utiliza Row Level Security no Supabase para garantir que cada usuário veja e edite apenas sua própria coleção.

As políticas foram configuradas para permitir operações apenas quando:

```sql
auth.uid() = user_id
```

## Deploy

O projeto pode ser publicado na Vercel.

Variáveis necessárias na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
```

A chave `SUPABASE_SERVICE_ROLE_KEY` não deve ser adicionada na Vercel, pois ela é usada apenas localmente para scripts administrativos.

## Melhorias futuras

* App mobile com React Native ou Expo
* Scanner de cartas
* Integração automática com preços da Liga Pokémon
* Histórico de preço por carta
* Página pública da coleção
* Wishlist avançada
* Exportação para Excel
* Sistema de metas
* Dashboard com gráficos
* Upload de imagem da carta
* Modo offline
* Compartilhamento da coleção

## Autor

Desenvolvido por **Diogo Aleixo de Andrade**.

Projeto criado para controle pessoal de coleção Pokémon TCG e também como projeto de portfólio.
