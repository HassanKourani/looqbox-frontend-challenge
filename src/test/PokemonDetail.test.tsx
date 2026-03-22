import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Routes, Route } from "react-router-dom";
import { PokemonDetail } from "../pages/PokemonDetail";
import { TestWrapper } from "./wrapper";

const mockPokemon = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  types: [{ type: { name: "electric" } }],
  abilities: [
    { ability: { name: "static" }, is_hidden: false },
    { ability: { name: "lightning-rod" }, is_hidden: true },
  ],
  stats: [
    { base_stat: 35, stat: { name: "hp" } },
    { base_stat: 55, stat: { name: "attack" } },
    { base_stat: 40, stat: { name: "defense" } },
    { base_stat: 50, stat: { name: "special-attack" } },
    { base_stat: 50, stat: { name: "special-defense" } },
    { base_stat: 90, stat: { name: "speed" } },
  ],
  sprites: {
    other: {
      "official-artwork": {
        front_default: "https://example.com/pikachu.png",
      },
    },
  },
};

beforeEach(() => {
  vi.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockPokemon),
  } as Response);
});

describe("Pokemon Detail", () => {
  const renderDetail = () =>
    render(
      <TestWrapper initialEntries={["/pokemon/pikachu"]}>
        <Routes>
          <Route path="/pokemon/:name" element={<PokemonDetail />} />
        </Routes>
      </TestWrapper>,
    );

  it("renders the pokemon name", async () => {
    renderDetail();
    expect(await screen.findByText("pikachu")).toBeInTheDocument();
  });

  it("renders the correct ID", async () => {
    renderDetail();
    expect(await screen.findByText("#025")).toBeInTheDocument();
  });

  it("renders the pokemon type", async () => {
    renderDetail();
    expect(await screen.findByText("electric")).toBeInTheDocument();
  });

  it("renders height and weight", async () => {
    renderDetail();
    expect(await screen.findByText("0.4 m")).toBeInTheDocument();
    expect(screen.getByText("6.0 kg")).toBeInTheDocument();
  });

  it("renders abilities", async () => {
    renderDetail();
    expect(await screen.findByText("static, lightning-rod")).toBeInTheDocument();
  });

  it("renders the back button", async () => {
    renderDetail();
    expect(await screen.findByText(/Back/)).toBeInTheDocument();
  });
});
