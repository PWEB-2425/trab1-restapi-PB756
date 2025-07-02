// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const runSeed = require('./seed');
const Curso = require('./models/curso');

const app = express();
app.use(cors());                     // <-- permite chamadas do Vercel
app.use(express.json());

app.get('/', (_req, res) => res.send('API online 🚀'));
app.use('/api/alunos', require('./routes/alunos'));
app.use('/api/cursos', require('./routes/cursos'));

async function start () {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🟢 MongoDB ligado');

  // Só semeia se ainda não houver cursos
  if (await Curso.countDocuments() === 0) {
    console.log('🌱 Base de dados vazia – a semear...');
    await runSeed();
  }

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`Servidor a ouvir em http://localhost:${PORT}`)
  );
}

start().catch(err => console.error('❌ Falha ao iniciar:', err));

