import { describe, it, expect } from "vitest";
import compareReducer, {
  toggleCompare,
  removeFromCompare,
  clearCompare,
  MAX_COMPARE,
} from "../store/compareSlice";

const initial = { names: [] as string[] };

describe("compareSlice", () => {
  it("adds a pokemon to compare list", () => {
    const state = compareReducer(initial, toggleCompare("pikachu"));
    expect(state.names).toEqual(["pikachu"]);
  });

  it("removes a pokemon when toggled again", () => {
    const state1 = compareReducer(initial, toggleCompare("pikachu"));
    const state2 = compareReducer(state1, toggleCompare("pikachu"));
    expect(state2.names).toEqual([]);
  });

  it("adds multiple pokemon", () => {
    let state = compareReducer(initial, toggleCompare("pikachu"));
    state = compareReducer(state, toggleCompare("bulbasaur"));
    state = compareReducer(state, toggleCompare("charmander"));
    expect(state.names).toEqual(["pikachu", "bulbasaur", "charmander"]);
  });

  it("does not exceed MAX_COMPARE limit", () => {
    let state = initial;
    state = compareReducer(state, toggleCompare("pikachu"));
    state = compareReducer(state, toggleCompare("bulbasaur"));
    state = compareReducer(state, toggleCompare("charmander"));
    state = compareReducer(state, toggleCompare("squirtle"));
    expect(state.names).toHaveLength(MAX_COMPARE);
    expect(state.names).not.toContain("squirtle");
  });

  it("removes a specific pokemon with removeFromCompare", () => {
    let state = compareReducer(initial, toggleCompare("pikachu"));
    state = compareReducer(state, toggleCompare("bulbasaur"));
    state = compareReducer(state, removeFromCompare("pikachu"));
    expect(state.names).toEqual(["bulbasaur"]);
  });

  it("clears all pokemon", () => {
    let state = compareReducer(initial, toggleCompare("pikachu"));
    state = compareReducer(state, toggleCompare("bulbasaur"));
    state = compareReducer(state, clearCompare());
    expect(state.names).toEqual([]);
  });

  it("can add after removing when at max", () => {
    let state = initial;
    state = compareReducer(state, toggleCompare("pikachu"));
    state = compareReducer(state, toggleCompare("bulbasaur"));
    state = compareReducer(state, toggleCompare("charmander"));
    state = compareReducer(state, removeFromCompare("bulbasaur"));
    state = compareReducer(state, toggleCompare("squirtle"));
    expect(state.names).toEqual(["pikachu", "charmander", "squirtle"]);
  });
});
