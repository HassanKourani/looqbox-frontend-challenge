import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Spin, Tag } from "antd";
import { getPokemonByName } from "../api/pokemon";
import "./PokemonDetail.css";

const STAT_COLORS: Record<string, string> = {
  hp: "#ef4444",
  attack: "#f97316",
  defense: "#eab308",
  "special-attack": "#3b82f6",
  "special-defense": "#22c55e",
  speed: "#ec4899",
};

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.ATK",
  "special-defense": "SP.DEF",
  speed: "SPD",
};

const TYPE_COLORS: Record<string, string> = {
  normal: "#a8a878",
  fire: "#f08030",
  water: "#6890f0",
  electric: "#f8d030",
  grass: "#78c850",
  ice: "#98d8d8",
  fighting: "#c03028",
  poison: "#a040a0",
  ground: "#e0c068",
  flying: "#a890f0",
  psychic: "#f85888",
  bug: "#a8b820",
  rock: "#b8a038",
  ghost: "#705898",
  dragon: "#7038f8",
  dark: "#705848",
  steel: "#b8b8d0",
  fairy: "#ee99ac",
};

const MAX_STAT = 255;

export function PokemonDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const { data: pokemon, isLoading, error } = useQuery({
    queryKey: ["pokemon", name],
    queryFn: () => getPokemonByName(name!),
    enabled: !!name,
  });

  if (isLoading) {
    return (
      <div className="detail-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="detail-error">
        <p>Failed to load Pokemon.</p>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </div>
    );
  }

  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default;
  const totalStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <div className="detail-page">
      <header className="detail-header">
        <Button
          type="text"
          className="back-button"
          onClick={() => navigate("/")}
        >
          &larr; Back
        </Button>
      </header>

      <div className="detail-layout">
        <div className="detail-left">
          <div className="detail-img-wrapper">
            <img
              src={imageUrl}
              alt={pokemon.name}
              onError={(e) => {
                e.currentTarget.src =
                  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
              }}
            />
          </div>
        </div>

        <div className="detail-right">
          <p className="detail-id">#{String(pokemon.id).padStart(3, "0")}</p>
          <h1 className="detail-name">{pokemon.name}</h1>

          <div className="detail-types">
            {pokemon.types.map((t) => (
              <Tag
                key={t.type.name}
                color={TYPE_COLORS[t.type.name] ?? "default"}
                className="type-tag"
              >
                {t.type.name}
              </Tag>
            ))}
          </div>

          <div className="detail-info-grid">
            <div className="info-item">
              <span className="info-label">Height</span>
              <span className="info-value">{(pokemon.height / 10).toFixed(1)} m</span>
            </div>
            <div className="info-item">
              <span className="info-label">Weight</span>
              <span className="info-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
            </div>
            <div className="info-item">
              <span className="info-label">Abilities</span>
              <span className="info-value">
                {pokemon.abilities.map((a) => a.ability.name).join(", ")}
              </span>
            </div>
          </div>

          <div className="detail-stats">
            <h2>Base Stats</h2>
            <div className="stats-list">
              {pokemon.stats.map((s) => {
                const pct = (s.base_stat / MAX_STAT) * 100;
                const color = STAT_COLORS[s.stat.name] ?? "var(--accent)";
                return (
                  <div key={s.stat.name} className="stat-row">
                    <span className="stat-label">
                      {STAT_LABELS[s.stat.name] ?? s.stat.name}
                    </span>
                    <span className="stat-value">{s.base_stat}</span>
                    <div className="stat-bar-bg">
                      <div
                        className="stat-bar-fill"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="stat-row stat-total">
                <span className="stat-label">TOT</span>
                <span className="stat-value">{totalStats}</span>
                <div className="stat-bar-bg">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${(totalStats / (MAX_STAT * 6)) * 100}%`,
                      backgroundColor: "var(--accent)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
