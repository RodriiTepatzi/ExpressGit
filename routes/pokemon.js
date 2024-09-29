const express = require('express');
const pokemon = express.Router();
const db = require('../config/database');

pokemon.get('/name/:name', (req, res) => {
  const namePattern = /^[a-zA-Z]+$/;
  const pokemonName = req.params.name;

  if (!namePattern.test(pokemonName)) {
    return res.status(400).json({ error: 'Formato de nombre de Pokémon no válido' });
  }

  const query = 'SELECT * FROM pokemon WHERE LOWER(pok_name) = LOWER(?)';
  db.query(query, [pokemonName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }
    res.json(results[0]);
  });
});

pokemon.get('/id/:id', (req, res) => {
  const idPattern = /^\d+$/;
  const pokemonId = req.params.id;

  if (!idPattern.test(pokemonId)) {
    return res.status(400).json({ error: 'Formato de ID no válido' });
  }

  const query = 'SELECT * FROM pokemon WHERE pok_id = ?';
  db.query(query, [pokemonId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }
    res.json(results[0]);
  });
});

pokemon.post('/', (req, res) => {
  const { pok_id, pok_name, pok_height, pok_weight, pok_base_experience } = req.body;

  const idPattern = /^\d+$/;
  const namePattern = /^[a-zA-Z]+$/;

  if (!idPattern.test(pok_id) || !namePattern.test(pok_name)) {
    return res.status(400).json({ error: 'Formato de datos de Pokémon no válido' });
  }

  const checkQuery = 'SELECT * FROM pokemon WHERE pok_id = ? OR LOWER(pok_name) = LOWER(?)';
  db.query(checkQuery, [pok_id, pok_name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'El Pokémon ya existe' });
    }

    const insertQuery = 'INSERT INTO pokemon (pok_id, pok_name, pok_height, pok_weight, pok_base_experience) VALUES (?, ?, ?, ?, ?)';
    db.query(insertQuery, [pok_id, pok_name, pok_height, pok_weight, pok_base_experience], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al agregar el Pokémon' });
      }
      res.status(201).json({ message: 'Pokémon agregado correctamente' });
    });
  });
});

pokemon.put('/:id', (req, res) => {
  const { pok_name, pok_height, pok_weight, pok_base_experience } = req.body;
  const pokemonId = req.params.id;

  const idPattern = /^\d+$/;
  if (!idPattern.test(pokemonId)) {
    return res.status(400).json({ error: 'Formato de ID no válido' });
  }

  const updateQuery = 'UPDATE pokemon SET pok_name = ?, pok_height = ?, pok_weight = ?, pok_base_experience = ? WHERE pok_id = ?';
  db.query(updateQuery, [pok_name, pok_height, pok_weight, pok_base_experience, pokemonId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar el Pokémon' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }
    res.json({ message: 'Pokémon actualizado correctamente' });
  });
});

pokemon.patch('/:id', (req, res) => {
  const pokemonId = req.params.id;
  const updates = req.body;

  const idPattern = /^\d+$/;
  if (!idPattern.test(pokemonId)) {
    return res.status(400).json({ error: 'Formato de ID no válido' });
  }

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  const queryFields = fields.map(field => `${field} = ?`).join(', ');
  const query = `UPDATE pokemon SET ${queryFields} WHERE pok_id = ?`;

  db.query(query, [...values, pokemonId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar parcialmente el Pokémon' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }
    res.json({ message: 'Pokémon actualizado parcialmente' });
  });
});

pokemon.delete('/:id', (req, res) => {
  const pokemonId = req.params.id;

  const idPattern = /^\d+$/;
  if (!idPattern.test(pokemonId)) {
    return res.status(400).json({ error: 'Formato de ID no válido' });
  }

  const deleteQuery = 'DELETE FROM pokemon WHERE pok_id = ?';
  db.query(deleteQuery, [pokemonId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el Pokémon' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }
    res.json({ message: 'Pokémon eliminado correctamente' });
  });
});

module.exports = pokemon;
