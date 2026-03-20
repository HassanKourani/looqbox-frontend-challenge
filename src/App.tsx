import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Pagination, Spin } from 'antd'
import { getPokemons, PAGE_SIZE } from './api/pokemon'
import { PokemonCard } from './components/PokemonCard'
import './App.css'

function App() {
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemons', page],
    queryFn: () => getPokemons(page),
  })

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokedex</h1>
      </header>

      {isLoading && (
        <div className="loading">
          <Spin size="large" />
        </div>
      )}

      {error && <p className="error">Failed to load Pokemon.</p>}

      {data && (
        <>
          <div className="pokemon-grid">
            {data.results.map((pokemon) => (
              <PokemonCard key={pokemon.name} pokemon={pokemon} />
            ))}
          </div>
          <div className="pagination">
            <Pagination
              current={page}
              total={data.count}
              pageSize={PAGE_SIZE}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default App
