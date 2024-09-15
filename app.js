const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

const pokedexPath = path.join(__dirname, 'pokedex.json');
let pokedex = JSON.parse(fs.readFileSync(pokedexPath, 'utf-8')).pokemon;

app.get('/pokemon/name/:name', (req, res) => {
  const namePattern = /^[a-zA-Z]+$/;
  const pokemonName = req.params.name;

  if (!namePattern.test(pokemonName)) {
    return res.status(400).json({ error: 'Formato de nombre de Pokémon no válido' });
  }

  const pokemon = pokedex.find(p => p.name.toLowerCase() === pokemonName.toLowerCase());

  if (!pokemon) {
    return res.status(404).json({ error: 'Pokémon no encontrado' });
  }

  res.json(pokemon);
});

app.get('/pokemon/id/:id', (req, res) => {
  const idPattern = /^\d+$/;
  const pokemonId = req.params.id;

  if (!idPattern.test(pokemonId)) {
    return res.status(400).json({ error: 'Formato de ID no válido' });
  }

  const pokemon = pokedex.find(p => p.id === parseInt(pokemonId, 10));

  if (!pokemon) {
    return res.status(404).json({ error: 'Pokémon no encontrado' });
  }

  res.json(pokemon);
});

app.get('/pokemon/num/:num', (req, res) => {
  const numPattern = /^\d{3}$/;
  const pokemonNum = req.params.num;

  if (!numPattern.test(pokemonNum)) {
    return res.status(400).json({ error: 'Formato de número de Pokémon no válido' });
  }

  const pokemon = pokedex.find(p => p.num === pokemonNum);

  if (!pokemon) {
    return res.status(404).json({ error: 'Pokémon no encontrado' });
  }

  res.json(pokemon);
});

app.get('/pokemon/type/:type', (req, res) => {
  const typePattern = /^[a-zA-Z]+$/;
  const pokemonType = req.params.type;

  if (!typePattern.test(pokemonType)) {
    return res.status(400).json({ error: 'Formato de tipo de Pokémon no válido' });
  }

  const filteredPokemon = pokedex.filter(p => p.type.some(t => t.toLowerCase() === pokemonType.toLowerCase()));

  if (filteredPokemon.length === 0) {
    return res.status(404).json({ error: 'No se encontraron Pokémon de este tipo' });
  }

  res.json(filteredPokemon);
});

app.get('/pokemon/spawn_time/:time', (req, res) => {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const spawnTime = req.params.time;

  if (!timePattern.test(spawnTime)) {
    return res.status(400).json({ error: 'Formato de tiempo no válido. Debe ser en formato HH:MM' });
  }

  const filteredPokemon = pokedex.filter(p => p.spawn_time === spawnTime);

  if (filteredPokemon.length === 0) {
    return res.status(404).json({ error: 'No se encontraron Pokémon con este horario de aparición' });
  }

  res.json(filteredPokemon);
});

app.post('/pokemon', (req, res) => {
  const { id, num, name, type, height, weight } = req.body;

  const idPattern = /^\d+$/;
  const namePattern = /^[a-zA-Z]+$/;
  const numPattern = /^\d{3}$/;

  if (!idPattern.test(id) || !namePattern.test(name) || !numPattern.test(num)) {
    return res.status(400).json({ error: 'Formato de datos de Pokémon no válido' });
  }

  if (pokedex.some(p => p.id === id || p.name.toLowerCase() === name.toLowerCase())) {
    return res.status(400).json({ error: 'El Pokémon ya existe' });
  }

  const newPokemon = {
    id,
    num,
    name,
    type,
    height,
    weight,
    img: '',
    candy: '',
    candy_count: 0,
    egg: '',
    spawn_chance: 0,
    avg_spawns: 0,
    spawn_time: '',
    multipliers: null,
    weaknesses: []
  };

  pokedex.push(newPokemon);

  fs.writeFileSync(pokedexPath, JSON.stringify({ pokemon: pokedex }, null, 2));

  res.status(201).json(newPokemon);
});

app.get('/pokemon/search', (req, res) => {
  const { num, type, weaknesses } = req.query;
  
  let results = pokedex;

  if (num && /^\d{3}$/.test(num)) {
    results = results.filter(p => p.num === num);
  }

  if (type && /^[a-zA-Z]+$/.test(type)) {
    results = results.filter(p => p.type.some(t => t.toLowerCase() === type.toLowerCase()));
  }

  if (weaknesses && /^[a-zA-Z]+$/.test(weaknesses)) {
    results = results.filter(p => p.weaknesses.some(w => w.toLowerCase() === weaknesses.toLowerCase()));
  }

  if (results.length === 0) {
    return res.status(404).json({ error: 'No se encontraron Pokémon que coincidan con los criterios de búsqueda' });
  }

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
