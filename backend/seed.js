require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const Aluno = require('./models/aluno');
const Curso = require('./models/curso');

const { cursos: cursosJSON, alunos: alunosJSON } =
  require(path.resolve(__dirname, '../mock-data/bd.json'));

async function runSeed () {
  await Curso.deleteMany({});
  await Aluno.deleteMany({});

  const cursosInseridos = await Curso.insertMany(
    cursosJSON.map(c => ({ nomeCurso: c.nomeCurso }))
  );

  const mapaCurso = {};
  cursosJSON.forEach(orig => {
    const match = cursosInseridos.find(c => c.nomeCurso === orig.nomeCurso);
    mapaCurso[orig.id] = match._id;
  });

  await Aluno.insertMany(
    alunosJSON.map(a => ({
      nome: a.nome,
      apelido: a.apelido,
      curso: mapaCurso[a.curso],
      anoCurricular: a.anoCurricular,
      idade: a.idade
    }))
  );
}

module.exports = runSeed;

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(runSeed)
    .then(() => console.log('✅ Seed concluído'))
    .finally(() => mongoose.disconnect());
}

seed();