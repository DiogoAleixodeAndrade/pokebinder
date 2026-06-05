function normalizePokemonName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[♀]/g, "-f")
    .replace(/[♂]/g, "-m")
    .replace(/[():.%]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

function getBaseOfficialArtworkUrl(dexNumber: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexNumber}.png`;
}

function getShowdownDexUrl(slug: string) {
  return `https://play.pokemonshowdown.com/sprites/dex/${slug}.png`;
}

function getShowdownGen5Url(slug: string) {
  return `https://play.pokemonshowdown.com/sprites/gen5/${slug}.png`;
}

function getPokemonDbArtworkUrl(slug: string) {
  return `https://img.pokemondb.net/artwork/large/${slug}.jpg`;
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getBaseNameFromKnownPrefix(name: string) {
  return name
    .replace(/^Mega\s+/i, "")
    .replace(/^Gigantamax\s+/i, "")
    .replace(/^Alolan\s+/i, "")
    .replace(/^Galarian\s+/i, "")
    .replace(/^Hisuian\s+/i, "")
    .replace(/^Paldean\s+/i, "")
    .replace(/^Primal\s+/i, "")
    .replace(/^Origin\s+/i, "")
    .replace(/^Altered\s+/i, "")
    .replace(/^Attack\s+/i, "")
    .replace(/^Defense\s+/i, "")
    .replace(/^Speed\s+/i, "")
    .replace(/^Normal\s+/i, "")
    .replace(/^Incarnate\s+/i, "")
    .replace(/^Therian\s+/i, "")
    .replace(/^Black\s+/i, "")
    .replace(/^White\s+/i, "")
    .trim();
}

function buildShowdownSlugs(name: string) {
  const normalized = normalizePokemonName(name);
  const slugs: string[] = [normalized];

  const baseName = normalizePokemonName(getBaseNameFromKnownPrefix(name));

  if (/^Mega\s+/i.test(name)) {
    if (/ X$/i.test(name)) {
      const base = normalizePokemonName(
        name.replace(/^Mega\s+/i, "").replace(/\s+X$/i, "")
      );

      slugs.push(`${base}-megax`);
      slugs.push(`${base}-mega-x`);
      slugs.push(`${base}-mega`);
    } else if (/ Y$/i.test(name)) {
      const base = normalizePokemonName(
        name.replace(/^Mega\s+/i, "").replace(/\s+Y$/i, "")
      );

      slugs.push(`${base}-megay`);
      slugs.push(`${base}-mega-y`);
      slugs.push(`${base}-mega`);
    } else {
      slugs.push(`${baseName}-mega`);
    }
  }

  if (/^Gigantamax\s+/i.test(name)) {
    slugs.push(`${baseName}-gmax`);
    slugs.push(`${baseName}-gigantamax`);
  }

  if (/Gigantamax$/i.test(name)) {
    const base = normalizePokemonName(name.replace(/\s+Gigantamax$/i, ""));
    slugs.push(`${base}-gmax`);
    slugs.push(`${base}-gigantamax`);
  }

  if (/^Alolan\s+/i.test(name)) {
    slugs.push(`${baseName}-alola`);
    slugs.push(`${baseName}-alolan`);
  }

  if (/^Galarian\s+/i.test(name)) {
    slugs.push(`${baseName}-galar`);
    slugs.push(`${baseName}-galarian`);
  }

  if (/^Hisuian\s+/i.test(name)) {
    slugs.push(`${baseName}-hisui`);
    slugs.push(`${baseName}-hisuian`);
  }

  if (/^Paldean\s+/i.test(name)) {
    slugs.push(`${baseName}-paldea`);
    slugs.push(`${baseName}-paldean`);
  }

  if (/^Primal\s+/i.test(name)) {
    slugs.push(`${baseName}-primal`);
  }

  if (/^Origin\s+/i.test(name)) {
    slugs.push(`${baseName}-origin`);
  }

  if (/^Altered\s+/i.test(name)) {
    slugs.push(`${baseName}-altered`);
  }

  if (/^Attack\s+/i.test(name)) {
    slugs.push(`${baseName}-attack`);
  }

  if (/^Defense\s+/i.test(name)) {
    slugs.push(`${baseName}-defense`);
  }

  if (/^Speed\s+/i.test(name)) {
    slugs.push(`${baseName}-speed`);
  }

  if (/^Normal\s+/i.test(name)) {
    slugs.push(`${baseName}`);
    slugs.push(`${baseName}-normal`);
  }

  if (/^Incarnate\s+/i.test(name)) {
    slugs.push(`${baseName}`);
    slugs.push(`${baseName}-incarnate`);
  }

  if (/^Black\s+/i.test(name)) {
    slugs.push(`${baseName}-black`);
  }

  if (/^White\s+/i.test(name)) {
    slugs.push(`${baseName}-white`);
  }

  if (/^Dawn\s+/i.test(name)) {
    slugs.push(`${baseName}-dawn-wings`);
    slugs.push(`${baseName}-dawn`);
  }

  if (/^Dusk\s+/i.test(name)) {
    slugs.push(`${baseName}-dusk-mane`);
    slugs.push(`${baseName}-dusk`);
  }

  if (/^Ultra\s+/i.test(name)) {
    slugs.push(`${baseName}-ultra`);
  }

  if (/^Rapid Strike\s+/i.test(name)) {
    slugs.push(`${baseName}-rapidstrike`);
    slugs.push(`${baseName}-rapid-strike`);
  }

  if (/^Single Strike\s+/i.test(name)) {
    slugs.push(`${baseName}-singlestrike`);
    slugs.push(`${baseName}-single-strike`);
  }

  if (/^Ice\s+/i.test(name)) {
    slugs.push(`${baseName}-ice`);
  }

  if (/^Shadow\s+/i.test(name)) {
    slugs.push(`${baseName}-shadow`);
  }

  if (/^Eternamax\s+/i.test(name)) {
    slugs.push(`${baseName}-eternamax`);
  }

  return unique(slugs);
}

function buildPokemonDbSlugs(name: string) {
  const normalized = normalizePokemonName(name);
  const slugs: string[] = [normalized];

  const baseName = normalizePokemonName(getBaseNameFromKnownPrefix(name));

  if (/^Mega\s+/i.test(name)) {
    if (/ X$/i.test(name)) {
      const base = normalizePokemonName(
        name.replace(/^Mega\s+/i, "").replace(/\s+X$/i, "")
      );

      slugs.push(`${base}-mega-x`);
      slugs.push(`${base}-megax`);
    } else if (/ Y$/i.test(name)) {
      const base = normalizePokemonName(
        name.replace(/^Mega\s+/i, "").replace(/\s+Y$/i, "")
      );

      slugs.push(`${base}-mega-y`);
      slugs.push(`${base}-megay`);
    } else {
      slugs.push(`${baseName}-mega`);
    }
  }

  if (/^Gigantamax\s+/i.test(name)) {
    slugs.push(`${baseName}-gigantamax`);
    slugs.push(`${baseName}-gmax`);
  }

  if (/^Alolan\s+/i.test(name)) {
    slugs.push(`${baseName}-alolan`);
    slugs.push(`${baseName}-alola`);
  }

  if (/^Galarian\s+/i.test(name)) {
    slugs.push(`${baseName}-galarian`);
    slugs.push(`${baseName}-galar`);
  }

  if (/^Hisuian\s+/i.test(name)) {
    slugs.push(`${baseName}-hisuian`);
    slugs.push(`${baseName}-hisui`);
  }

  if (/^Paldean\s+/i.test(name)) {
    slugs.push(`${baseName}-paldean`);
    slugs.push(`${baseName}-paldea`);
  }

  if (/^Primal\s+/i.test(name)) {
    slugs.push(`${baseName}-primal`);
  }

  return unique(slugs);
}

export function getPokemonArtworkCandidates(name: string, dexNumber: number) {
  const showdownSlugs = buildShowdownSlugs(name);
  const pokemonDbSlugs = buildPokemonDbSlugs(name);

  const urls = [
    ...showdownSlugs.map(getShowdownDexUrl),
    ...showdownSlugs.map(getShowdownGen5Url),
    ...pokemonDbSlugs.map(getPokemonDbArtworkUrl),
    getBaseOfficialArtworkUrl(dexNumber),
  ];

  return unique(urls);
}

export function getPokemonArtworkUrl(dexNumber: number) {
  return getBaseOfficialArtworkUrl(dexNumber);
}