const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('API online 🚀'));

app.use('/api/alunos', require('./routes/alunos'));
app.use('/api/cursos', require('./routes/cursos'));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('🟢 MongoDB ligado'))
  .catch(err => console.error('🔴 Erro MongoDB', err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor a ouvir em http://localhost:${PORT}`));

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Erro de validação',
      details: err.errors 
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      error: 'ID inválido',
      details: err.message 
    });
  }
  
  res.status(500).json({ 
    error: 'Erro interno no servidor',
    message: err.message 
  });
});
