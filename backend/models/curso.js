const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nomeCurso: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Curso', cursoSchema);