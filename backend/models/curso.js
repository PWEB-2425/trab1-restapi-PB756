const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nomeCurso: { 
    type: String, 
    required: true,
    unique: true, // Evita duplicatas
    trim: true    // Remove espaços extras
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Curso', cursoSchema);