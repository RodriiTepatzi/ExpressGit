const apiUrl = 'http://localhost:3000/pokemon';

function getAllPokemon() {
    axios.get(apiUrl)
        .then(response => displayAllPokemon(response.data))
        .catch(error => console.error('Error:', error));
}

function displayAllPokemon(pokemonList) {
    const container = document.getElementById('pokemonContainer');
    container.innerHTML = '';
    pokemonList.forEach(pokemon => {
        container.innerHTML += `
            <div class="pokemon">
                <h2>${pokemon.pok_name}</h2>
                <p>ID: ${pokemon.pok_id}</p>
                <p>Height: ${pokemon.pok_height}</p>
                <p>Weight: ${pokemon.pok_weight}</p>
                <p>Base Experience: ${pokemon.pok_base_experience}</p>
            </div>
        `;
    });
}

window.onload = getAllPokemon;