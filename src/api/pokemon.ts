const BASE_URL = "https://pokeapi.co/api/v2";

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export function getPokemonId(url: string): string {
  const segments = url.replace(/\/$/, "").split("/");
  return segments[segments.length - 1];
}

export function getPokemonImageUrl(id: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export const PAGE_SIZE = 20;

export async function getPokemons(page: number): Promise<PokemonListResponse> {
  const offset = (page - 1) * PAGE_SIZE;
  const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${PAGE_SIZE}`);
  if (!response.ok) throw new Error("Failed to fetch pokemons");
  return response.json();
}

export async function getAllPokemons(): Promise<PokemonListItem[]> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=99999`);
  if (!response.ok) throw new Error("Failed to fetch pokemons");
  const data: PokemonListResponse = await response.json();
  return data.results;
}
