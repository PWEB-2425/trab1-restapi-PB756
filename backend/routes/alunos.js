const express = require('express');
const mongoose = require('mongoose');
const Aluno = require('../models/aluno');
const Curso  = require('../models/curso');
const router = express.Router();

// Middleware para validar ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  next();
};

// GET /api/alunos
router.get('/', async (_req, res) => {
  const lista = await Aluno.find().populate('curso');
  res.json(lista);
});

// GET /api/alunos/:id
router.get('/:id', validateObjectId, async (req, res) => {
  const a = await Aluno.findById(req.params.id).populate('curso');
  if (!a) return res.status(404).json({ error: 'Aluno não encontrado' });
  res.json(a);
});

// POST /api/alunos
router.post('/', async (req, res) => {
  try {
    const { nome, apelido, cursoText, anoCurricular, idade } = req.body;

    if (!nome || !apelido || !cursoText || !anoCurricular) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // procura ou cria curso
    let cursoDoc = await Curso.findOne({ nomeCurso: cursoText });
    if (!cursoDoc) {
      cursoDoc = await Curso.create({ nomeCurso: cursoText });
    }

    const novo = new Aluno({
      nome,
      apelido,
      curso: cursoDoc._id,
      anoCurricular,
      idade
    });

    await novo.save();
    res.status(201).json(await novo.populate('curso'));
  } catch (err) {
    console.error('Erro ao criar aluno:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro ao criar aluno' });
  }
});

// PUT /api/alunos/:id
router.put('/:id', validateObjectId, async (req, res) => {
  try {
    const { nome, apelido, cursoText, anoCurricular, idade } = req.body;

    if (!nome || !apelido || !cursoText || !anoCurricular) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    let cursoDoc = await Curso.findOne({ nomeCurso: cursoText });
    if (!cursoDoc) {
      cursoDoc = await Curso.create({ nomeCurso: cursoText });
    }

    const a = await Aluno.findByIdAndUpdate(
      req.params.id,
      {
        nome,
        apelido,
        curso: cursoDoc._id,
        anoCurricular,
        idade
      },
      { new: true, runValidators: true }
    ).populate('curso');

    if (!a) return res.status(404).json({ error: 'Aluno não encontrado' });
    res.json(a);

  } catch (err) {
    console.error('Erro ao atualizar aluno:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
});

// DELETE /api/alunos/:id
router.delete('/:id', validateObjectId, async (req, res) => {
  await Aluno.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;