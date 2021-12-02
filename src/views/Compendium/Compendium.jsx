import { useState, useEffect } from 'react';
import PokemonList from '../../components/PokemonList/PokemonList';
import {
	fetchFilteredPokemon,
	fetchPokemon,
	fetchSearchPokemon,
	fetchTypes,
} from '../../services/pokemon';
import './Compendium.css';
import Controls from '../../components/Controls/Controls';
import pokeball from '../../assets/pokeball.png';

export default function Compendium() {
	const [loading, setLoading] = useState(true);
	const [pokemons, setPokemons] = useState([]);
	const [searchName, setSearchName] = useState('');
	const [types, setTypes] = useState([]);
	const [selectedType, setSelectedType] = useState('all');

	useEffect(() => {
		async function getPokemon() {
			const pokemonList = await fetchPokemon();
			setPokemons(pokemonList);
			setLoading(false);
		}
		getPokemon();
	}, []);

	useEffect(() => {
		async function getTypes() {
			const pokemonTypes = await fetchTypes();
			setTypes(pokemonTypes);
		}
		getTypes();
	}, []);

	useEffect(() => {
		if (!selectedType) return;
		async function getFilteredPokemon() {
			setLoading(true);

			if (selectedType !== 'all') {
				const filteredPokemon = await fetchFilteredPokemon(selectedType);
				setPokemons(filteredPokemon);
				setLoading(false);
			} else {
				const pokemonList = await fetchPokemon();
				setPokemons(pokemonList);
			}
			setLoading(false);
			// setSort('');
		}

		getFilteredPokemon();
	}, [selectedType]);

	const handleSubmit = (event) => {
		event.preventDefault();
		setLoading(true);
		fetchSearchPokemon(searchName)
			.then((searchedPokemons) => {
				this.setState({ pokemons: searchedPokemons });
			})
			.catch((error) => {})
			.finally(() => {
				setLoading(false);
				setSearchName('');
				setSelectedType('');
			});
	};

	return (
		<div className='app'>
			<main>
				<div className='title'>
					<img src={pokeball} alt='pokeball' />
					<h1 className='titleText'>Alchemy Compendium</h1>
				</div>
				<Controls
					name={searchName}
					handleSubmit={handleSubmit}
					handleNameChange={setSearchName}
					types={types}
					filterChange={setSelectedType}
					selectedType={selectedType}
				/>
				{loading ? (
					<code>Search for the bugs in the code!</code>
				) : (
					<PokemonList pokemons={pokemons} />
				)}
			</main>
		</div>
	);
}
