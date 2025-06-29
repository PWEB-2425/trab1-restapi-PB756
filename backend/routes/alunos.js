const express = require('express');
const mongoose = require('mongoose');
const Aluno = require('../models/aluno');
const router = express.Router();

// Middleware para validar ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  next();
};

// GET /api/alunos
router.get('/', async (req, res) => {
  try {
    const lista = await Aluno.find().populate('curso');
    res.json(lista);
  } catch (err) {
    console.error('Erro ao buscar alunos:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// GET /api/alunos/:id
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const a = await Aluno.findById(req.params.id).populate('curso');
    if (!a) return res.status(404).json({ error: 'Aluno não encontrado' });
    res.json(a);
  } catch (err) {
    console.error('Erro ao buscar aluno:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// POST /api/alunos
router.post('/', async (req, res) => {
  try {
    // 1) Extrair propriedades
    const { nome, apelido, cursoText, anoCurricular, idade } = req.body;

    // 2) Validar campos obrigatórios
    if (!nome || !apelido || !cursoText || !anoCurricular) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // 3) Procurar ou criar o curso
    let cursoDoc = await Curso.findOne({ nomeCurso: cursoText });
    if (!cursoDoc) {
      cursoDoc = await Curso.create({ nomeCurso: cursoText });
    }

    // 4) Criar o novo aluno
    const novo = new Aluno({
      nome,
      apelido,
      curso: cursoDoc._id,
      anoCurricular,
      idade
    });

    await novo.save();
    return res.status(201).json(novo);

  } catch (err) {
    console.error('Erro ao criar aluno:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Erro ao criar aluno' });
  }
});

// PUT /api/alunos/:id
router.put('/:id', validateObjectId, async (req, res) => {
  try {
    // 1) Extrair dados do body
    const { nome, apelido, cursoText, anoCurricular, idade } = req.body;

    // 2) Validar campos obrigatórios
    if (!nome || !apelido || !cursoText || !anoCurricular) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // 3) Procurar ou criar o curso
    let cursoDoc = await Curso.findOne({ nomeCurso: cursoText });
    if (!cursoDoc) {
      cursoDoc = await Curso.create({ nomeCurso: cursoText });
    }

    // 4) Atualizar o aluno referenciando cursoDoc._id
    const alunoAtualizado = await Aluno.findByIdAndUpdate(
      req.params.id,
      {
        nome,
        apelido,
        curso: cursoDoc._id,
        anoCurricular,
        idade
      },
      { new: true, runValidators: true }
    );

    if (!alunoAtualizado) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    return res.json(alunoAtualizado);

  } catch (err) {
    console.error('Erro ao atualizar aluno:', err);

    // Validations do Mongoose
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
});

// DELETE /api/alunos/:id
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const result = await Aluno.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Aluno não encontrado' });
    res.status(204).end();
  } catch (err) {
    console.error('Erro ao excluir aluno:', err);
    res.status(500).json({ error: 'Erro ao excluir aluno' });
  }
});

module.exports = router;