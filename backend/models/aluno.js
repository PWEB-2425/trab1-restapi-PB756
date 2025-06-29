const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  apelido: { type: String, required: true },
  curso: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: true 
  },
  anoCurricular: { type: Number, required: true },
  idade: { type: Number }
}, {
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  }
});

module.exports = mongoose.model('Aluno', alunoSchema);