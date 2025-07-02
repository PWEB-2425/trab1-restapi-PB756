const express = require('express');
const mongoose = require('mongoose');
const Curso = require('../models/curso');
const router = express.Router();

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  next();
};

router.get('/', async (req, res) => {
  try {
    const lista = await Curso.find();
    res.json(lista);
  } catch (err) {
    console.error('Erro ao buscar cursos:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const c = await Curso.findById(req.params.id);
    if (!c) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }
    res.json(c);
  } catch (err) {
    console.error('Erro ao buscar curso:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.body.nomeCurso) {
      return res.status(400).json({ error: 'Nome do curso é obrigatório' });
    }

    const novo = new Curso({
      nomeCurso: req.body.nomeCurso
    });

    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar curso:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: 'Erro ao criar curso' });
  }
});

router.put('/:id', validateObjectId, async (req, res) => {
  try {
    if (!req.body.nomeCurso) {
      return res.status(400).json({ error: 'Nome do curso é obrigatório' });
    }

    const c = await Curso.findByIdAndUpdate(
      req.params.id,
      { nomeCurso: req.body.nomeCurso },
      { new: true, runValidators: true }
    );

    if (!c) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }
    
    res.json(c);
  } catch (err) {
    console.error('Erro ao atualizar curso:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: 'Erro ao atualizar curso' });
  }
});

router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const result = await Curso.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }
    
    res.status(204).end();
  } catch (err) {
    console.error('Erro ao excluir curso:', err);
    res.status(500).json({ error: 'Erro ao excluir curso' });
  }
});

module.exports = router;
