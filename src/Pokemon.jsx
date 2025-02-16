
import React, { useEffect, useState } from "react";
import PokemonCards from "./PokiCards";
import "./index.css";

export const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState(""); // Store selected type
  const [loading, setLoading] = useState(true);

  const API = "https://pokeapi.co/api/v2/pokemon?limit=500";

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const detailedPokemon = data.results.map(async (currentPokemon) => {
        const res = await fetch(currentPokemon.url);
        const data = await res.json();
        return data;
      });

      const detailedResponses = await Promise.all(detailedPokemon);

      if (detailedResponses) {
        setLoading(false);
        setPokemon(detailedResponses);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  // ✅ Filtering Pokémon by search AND selected type
  const searchData = pokemon.filter((currentPokemon) => {
    const matchesSearch = currentPokemon.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      selectedType === "" ||
      currentPokemon.types.some((type) => type.type.name === selectedType);

    return matchesSearch && matchesType;
  });

  // ✅ Update selected type on button click
  const handleTypeClick = (type) => {
    setSelectedType(type);
  };

  // ✅ Reset type filter
  const clearFilter = () => {
    setSelectedType("");
  };

  if (error) {
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  }
  return (
    <>
      <section>
        <header>
          <h1>Catch the Pokemon's</h1>
        </header>

        {/* ✅ Search Input & Type Buttons in One Line */}
        <div className="search-bar">
          <input
            className="search-input"
            placeholder="Search..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="type-buttons">
            <button onClick={() => handleTypeClick("poison")}>Poison</button>
            <button onClick={() => handleTypeClick("fire")}>Fire</button>
            <button onClick={() => handleTypeClick("water")}>Water</button>
            <button onClick={() => handleTypeClick("bug")}>Bug</button>
            <button onClick={() => handleTypeClick("electric")}>Electric</button>
            <button onClick={clearFilter}>Clear Filter</button>
          </div>
        </div>

        {/* ✅ Display Pokémon */}
        <div className="cards">
          {searchData.length > 0 ? (
            searchData.map((currentPokemon) => (
              <PokemonCards key={currentPokemon.id} pokemonData={currentPokemon} />
            ))
          ) : (
            <p>No Pokémon found!</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Pokemon;