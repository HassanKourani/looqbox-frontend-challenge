import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import type { PokemonListItem } from "../api/pokemon";
import { getPokemonId, getPokemonImageUrl } from "../api/pokemon";
import { FALLBACK_IMAGE } from "../constants/pokemon";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleCompare, MAX_COMPARE } from "../store/compareSlice";
import "./PokemonCard.css";

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const id = getPokemonId(pokemon.url);
  const imageUrl = getPokemonImageUrl(id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const compareNames = useAppSelector((s) => s.compare.names);
  const isSelected = compareNames.includes(pokemon.name);
  const isFull = compareNames.length >= MAX_COMPARE;

  return (
    <Card
      className={`pokemon-card ${isSelected ? "pokemon-card--selected" : ""}`}
      hoverable
      onClick={() => navigate(`/pokemon/${pokemon.name}`)}
      cover={
        <div className="pokemon-img-wrapper">
          <img
            src={imageUrl}
            alt={pokemon.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </div>
      }
    >
      <p className="pokemon-id">#{id.padStart(3, "0")}</p>
      <p className="pokemon-name">{pokemon.name}</p>
      <button
        className={`compare-btn ${isSelected ? "compare-btn--active" : ""}`}
        disabled={!isSelected && isFull}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(toggleCompare(pokemon.name));
        }}
      >
        {isSelected ? "Remove" : "Compare"}
      </button>
    </Card>
  );
}
