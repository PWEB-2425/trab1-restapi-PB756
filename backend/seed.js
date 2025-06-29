// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

// Modelos
const Aluno = require('./models/aluno');
const Curso = require('./models/curso');

// Lê o JSON original com ids de cursos
const { cursos: cursosJSON, alunos: alunosJSON } =
  require(path.resolve(__dirname, '../mock-data/bd.json'));

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔄 Conectado ao MongoDB Atlas');

    // Limpar coleções
    await Curso.deleteMany({});
    await Aluno.deleteMany({});
    console.log('🗑️  Coleções limpas');

    // Inserir cursos e montar mapa idNum → ObjectId
    const cursosInseridos = await Curso.insertMany(
      // só leva nomeCurso; o campo id fica só no mapa
      cursosJSON.map(c => ({ nomeCurso: c.nomeCurso }))
    );

    // Mapa robusto: percorre o JSON original e encontra o _id pelo nomeCurso
    const mapaCurso = {};
    cursosJSON.forEach(orig => {
      const match = cursosInseridos.find(
        ins => ins.nomeCurso === orig.nomeCurso
      );
      if (!match) {
        throw new Error(`Curso não encontrado no insert: ${orig.nomeCurso}`);
      }
      mapaCurso[orig.id] = match._id;
    });
    console.log(`✅ ${cursosInseridos.length} cursos inseridos`);

    // Preparar e inserir alunos, usando mapaCurso para o ObjectId
    const alunosParaInserir = alunosJSON.map(a => {
      const cursoId = mapaCurso[a.curso];
      if (!cursoId) {
        throw new Error(
          `Mapeamento duplicado ou ausente para aluno ${a.nome} curso ${a.curso}`
        );
      }
      return {
        nome: a.nome,
        apelido: a.apelido,
        curso: cursoId,
        anoCurricular: a.anoCurricular,
        idade: a.idade
      };
    });

    const alunosInseridos = await Aluno.insertMany(alunosParaInserir);
    console.log(`✅ ${alunosInseridos.length} alunos inseridos`);

  } catch (err) {
    console.error('❌ Erro no seed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desligado do MongoDB');
  }
}

seed();