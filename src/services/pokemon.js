import { pokeMunger } from '../utils/helpers';

const favPokemon = [
	'charizard',
	'typhlosion',
	'blaziken',
	'mewtwo',
	'suicune',
	'pidgeot',
	'golduck',
	'gardevoir',
	'ninetales',
	'houndoom',
];

export const fetchPokemon = async () => {
	const pokemonList = await Promise.all(
		favPokemon.map(async (fav) => {
			const fetchedPokemon = await fetch(
				`https://pokedex-alchemy.herokuapp.com/api/pokedex?pokemon=${fav}`
			);

			const pokemonData = await fetchedPokemon.json();

			// Need to filter mega pokemon
			if (pokemonData.count > 1) {
				const exactPokemon = pokemonData.results.find(
					(result) => result.pokemon === fav
				);
				return pokeMunger(exactPokemon);
			}

			return pokeMunger(pokemonData.results[0]);
		})
	);
	return pokemonList;
};

export const fetchSearchPokemon = async (pokemonName) => {
	const lowerCaseName = pokemonName.toLowerCase();
	const res = await fetch(
		`https://pokedex-alchemy.herokuapp.com/api/pokedex?pokemon=${lowerCaseName}`
	);
	const searchData = await res.json();
	const pokemonResults = searchData.results.map((pokemon) =>
		pokeMunger(pokemon)
	);
	return pokemonResults;
};

export const fetchTypes = async () => {
	const res = await fetch(
		`https://pokedex-alchemy.herokuapp.com/api/pokedex/types`
	);
	const pokemonTypesData = await res.json();

	// get random types
	const randomTypes = pokemonTypesData
		.map((pokemonType) => pokemonType.type)
		.sort(() => 0.5 - Math.random())
		.slice(0, 5);
	return randomTypes;
};

export const fetchFilteredPokemon = async (randomTypes) => {
	const res = await fetch(
		`https://pokedex-alchemy.herokuapp.com/api/pokedex?type=${randomTypes}`
	);
	const pokemonData = await res.json();

	const filteredPokemon = pokemonData.results.map((pokemon) =>
		pokeMunger(pokemon)
	);
	return filteredPokemon;
};
