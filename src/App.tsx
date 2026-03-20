import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input, Pagination, Spin } from "antd";
import { getAllPokemons, getPokemons, PAGE_SIZE } from "./api/pokemon";
import { PokemonCard } from "./components/PokemonCard";
import "./App.css";

function App() {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pokemons", page],
    queryFn: () => getPokemons(page),
    enabled: !search,
  });

  const { data: allPokemons } = useQuery({
    queryKey: ["allPokemons"],
    queryFn: getAllPokemons,
    enabled: !!search,
    staleTime: 1000 * 60 * 5,
  });

  const filtered = useMemo(() => {
    if (!search || !allPokemons) return [];
    const term = search.toLowerCase();
    return allPokemons.filter((p) => p.name.includes(term));
  }, [search, allPokemons]);

  const pokemons = search ? filtered : (data?.results ?? []);
  const isSearching = !!search;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokedex</h1>
        <Input.Search
          placeholder="Search Pokemon..."
          allowClear
          size="large"
          onChange={(e) => setInputValue(e.target.value)}
          className="search-input"
        />
      </header>

      {isLoading && !isSearching && (
        <div className="loading">
          <Spin size="large" />
        </div>
      )}

      {error && !isSearching && (
        <p className="error">Failed to load Pokemon.</p>
      )}

      {isSearching && search && filtered.length === 0 && allPokemons && (
        <p className="no-results">No Pokemon found for "{search}"</p>
      )}

      {pokemons.length > 0 && (
        <>
          <div className="pokemon-grid">
            {pokemons.map((pokemon) => (
              <PokemonCard key={pokemon.name} pokemon={pokemon} />
            ))}
          </div>
          {!isSearching && data && (
            <div className="pagination">
              <Pagination
                current={page}
                total={data.count}
                pageSize={PAGE_SIZE}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
