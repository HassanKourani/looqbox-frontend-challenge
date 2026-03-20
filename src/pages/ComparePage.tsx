import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { Button, Spin, Tag } from "antd";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { getPokemonByName, type PokemonDetail } from "../api/pokemon";
import {
  FALLBACK_IMAGE,
  MAX_STAT,
  STAT_LABELS,
  TYPE_COLORS,
} from "../constants/pokemon";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { clearCompare } from "../store/compareSlice";
import "./ComparePage.css";

const RADAR_COLORS = ["#aa3bff", "#f97316", "#22c55e"];

export function ComparePage() {
  const names = useAppSelector((s) => s.compare.names);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const queries = useQueries({
    queries: names.map((name) => ({
      queryKey: ["pokemon", name],
      queryFn: () => getPokemonByName(name),
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const hasError = queries.some((q) => q.error);
  const pokemons = queries
    .map((q) => q.data)
    .filter((d): d is PokemonDetail => !!d);

  if (names.length < 2) {
    return (
      <div className="compare-empty">
        <p>Select at least 2 Pokemon to compare.</p>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="compare-empty">
        <Spin size="large" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="compare-empty">
        <p>Failed to load Pokemon data.</p>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </div>
    );
  }

  // Build merged chart data: one entry per stat, with a value key per pokemon
  const statNames = pokemons[0].stats.map((s) => s.stat.name);
  const chartData = statNames.map((statName) => {
    const entry: Record<string, string | number> = {
      stat: STAT_LABELS[statName] ?? statName,
    };
    pokemons.forEach((p) => {
      const found = p.stats.find((s) => s.stat.name === statName);
      entry[p.name] = found?.base_stat ?? 0;
    });
    return entry;
  });

  return (
    <div className="compare-page">
      <header className="compare-header">
        <Button type="text" className="back-button" onClick={() => navigate("/")}>
          &larr; Back
        </Button>
        <Button size="small" onClick={() => { dispatch(clearCompare()); navigate("/"); }}>
          Clear All
        </Button>
      </header>

      <h1 className="compare-title">Compare Pokemon</h1>

      {/* Pokemon info cards side by side */}
      <div className="compare-cards">
        {pokemons.map((pokemon, i) => {
          const imageUrl = pokemon.sprites.other["official-artwork"].front_default;
          return (
            <div key={pokemon.name} className="compare-card" style={{ borderColor: RADAR_COLORS[i] }}>
              <div className="compare-card-img">
                <img
                  src={imageUrl}
                  alt={pokemon.name}
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                />
              </div>
              <p className="compare-card-id">#{String(pokemon.id).padStart(3, "0")}</p>
              <p className="compare-card-name">{pokemon.name}</p>
              <div className="compare-card-types">
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
              <div className="compare-card-meta">
                <span>{(pokemon.height / 10).toFixed(1)} m</span>
                <span>{(pokemon.weight / 10).toFixed(1)} kg</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overlaid radar chart */}
      <div className="compare-chart">
        <h2>Stats Comparison</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="stat"
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
                textTransform: "capitalize",
              }}
            />
            {pokemons.map((p, i) => (
              <Radar
                key={p.name}
                name={p.name}
                dataKey={p.name}
                stroke={RADAR_COLORS[i]}
                fill={RADAR_COLORS[i]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
            <Legend
              formatter={(value: string) => (
                <span style={{ textTransform: "capitalize", fontSize: 14 }}>{value}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
