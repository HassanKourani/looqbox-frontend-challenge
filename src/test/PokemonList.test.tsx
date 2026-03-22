import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";
import { TestWrapper } from "./wrapper";

const mockPokemons = {
  count: 3,
  next: null,
  previous: null,
  results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
    { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
  ],
};

beforeEach(() => {
  vi.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockPokemons),
  } as Response);
});

describe("Pokemon List", () => {
  it("renders all pokemon cards with correct names", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    );

    expect(await screen.findByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("charmander")).toBeInTheDocument();
    expect(screen.getByText("squirtle")).toBeInTheDocument();
  });

  it("renders correct IDs for each pokemon", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    );

    expect(await screen.findByText("#001")).toBeInTheDocument();
    expect(screen.getByText("#004")).toBeInTheDocument();
    expect(screen.getByText("#007")).toBeInTheDocument();
  });

  it("renders the correct number of cards", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    );

    await screen.findByText("bulbasaur");
    const cards = screen.getAllByText(/Compare/);
    expect(cards).toHaveLength(3);
  });
});
