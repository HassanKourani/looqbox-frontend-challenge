import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import type { PokemonListItem } from "../api/pokemon";
import { getPokemonId, getPokemonImageUrl } from "../api/pokemon";
import "./PokemonCard.css";

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const id = getPokemonId(pokemon.url);
  const imageUrl = getPokemonImageUrl(id);
  const navigate = useNavigate();

  return (
    <Card
      className="pokemon-card"
      hoverable
      onClick={() => navigate(`/pokemon/${pokemon.name}`)}
      cover={
        <div className="pokemon-img-wrapper">
          <img
            src={imageUrl}
            alt={pokemon.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
            }}
          />
        </div>
      }
    >
      <p className="pokemon-id">#{id.padStart(3, "0")}</p>
      <p className="pokemon-name">{pokemon.name}</p>
    </Card>
  );
}
