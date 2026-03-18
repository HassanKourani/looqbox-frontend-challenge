const BASE_URL = "https://pokeapi.co/api/v2";

export async function getPokemons() {
  const response = await fetch(`${BASE_URL}/pokemon`);
  if (!response.ok) throw new Error("Failed to fetch pokemons");
  return response.json();
}
