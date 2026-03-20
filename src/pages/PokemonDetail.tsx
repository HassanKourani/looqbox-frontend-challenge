import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Spin, Tag } from "antd";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getPokemonByName } from "../api/pokemon";
import {
  FALLBACK_IMAGE,
  MAX_STAT,
  STAT_COLORS,
  STAT_LABELS,
  TYPE_COLORS,
} from "../constants/pokemon";
import "./PokemonDetail.css";

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

  const chartData = pokemon.stats.map((s) => ({
    name: STAT_LABELS[s.stat.name] ?? s.stat.name,
    value: s.base_stat,
    fill: STAT_COLORS[s.stat.name] ?? "var(--accent)",
  }));

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

      <div className="detail-top">
        <div className="detail-img-wrapper">
          <img
            src={imageUrl}
            alt={pokemon.name}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </div>

        <div className="detail-info">
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

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Height</span>
              <span className="meta-value">{(pokemon.height / 10).toFixed(1)} m</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Weight</span>
              <span className="meta-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Abilities</span>
              <span className="meta-value">
                {pokemon.abilities.map((a) => a.ability.name).join(", ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-stats">
        <h2>Base Stats</h2>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fontSize: 13, fontFamily: "var(--mono)", fill: "var(--text-h)" }}
            />
            <PolarRadiusAxis
              domain={[0, MAX_STAT]}
              tick={{ fontSize: 10, fill: "var(--text)" }}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Radar
              dataKey="value"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
