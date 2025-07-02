const baseUrl = window.location.hostname.endsWith('.vercel.app')
  ? 'https://trab1-restapi-pb756-1.onrender.com/api'
  : 'http://localhost:4000/api';

const tabelaBody = document.querySelector("#tabela-alunos tbody");
const form = document.getElementById("form-aluno");
const btnCancelar = document.getElementById("btn-cancelar");
const formTitle = document.getElementById("form-title");

const $ = (id) => document.getElementById(id);

async function carregarCursos() {
  try {
    const resp = await fetch(`${baseUrl}/cursos`);
    const cursos = await resp.json();
    const datalist = $("lista-cursos");
    datalist.innerHTML = "";
    cursos.forEach(curso => {
      const option = document.createElement("option");
      option.value = curso.nomeCurso;
      datalist.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar cursos:", err);
  }
}

function linhaAluno(aluno) {
  return `
    <tr>
      <td>${aluno.id}</td>
      <td>${aluno.nome}</td>
      <td>${aluno.apelido}</td>
      <td>${aluno.curso?.nomeCurso || "-"}</td>
      <td>${aluno.anoCurricular}</td>
      <td>${aluno.idade ?? "-"}</td>
      <td>
        <button class="btn-editar" data-id="${aluno.id}">✏️</button>
        <button class="btn-apagar" data-id="${aluno.id}">🗑️</button>
      </td>
    </tr>
  `;
}

async function listarAlunos() {
  try {
    const resp = await fetch(`${baseUrl}/alunos`);
    const alunos = await resp.json();
    tabelaBody.innerHTML = alunos.map(linhaAluno).join("");
  } catch (err) {
    console.error("Erro ao carregar alunos:", err);
  }
}

async function criarAluno(dados) {
  await fetch(`${baseUrl}/alunos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

async function atualizarAluno(id, dados) {
  await fetch(`${baseUrl}/alunos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

async function apagarAluno(id) {
  await fetch(`${baseUrl}/alunos/${id}`, { method: "DELETE" });
}

tabelaBody.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("btn-apagar")) {
    if (confirm("Apagar aluno?")) {
      await apagarAluno(id);
      listarAlunos();
    }
  }

  if (e.target.classList.contains("btn-editar")) {
    const resp = await fetch(`${baseUrl}/alunos/${id}`);
    const aluno = await resp.json();

    $("aluno-id").value = id;
    $("nome").value = aluno.nome;
    $("apelido").value = aluno.apelido;
    $("curso-input").value = aluno.curso.nomeCurso;
    $("ano").value = aluno.anoCurricular;
    $("idade").value = aluno.idade || "";

    formTitle.textContent = "Editar aluno";
    btnCancelar.style.display = "inline";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    nome: $("nome").value.trim(),
    apelido: $("apelido").value.trim(),
    cursoText: $("curso-input").value.trim(),
    anoCurricular: +$("ano").value,
    idade: $("idade").value ? +$("idade").value : undefined,
  };

  const id = $("aluno-id").value;

  try {
    if (id) {
      await atualizarAluno(id, dados);
    } else {
      await criarAluno(dados);
    }
    form.reset();
    $("aluno-id").value = "";
    formTitle.textContent = "Adicionar aluno";
    btnCancelar.style.display = "none";
    listarAlunos();
  } catch (err) {
    console.error("Erro ao salvar aluno:", err);
    alert("Erro ao salvar aluno");
  }
});

btnCancelar.addEventListener("click", () => {
  form.reset();
  $("aluno-id").value = "";
  formTitle.textContent = "Adicionar aluno";
  btnCancelar.style.display = "none";
});

carregarCursos();
listarAlunos();

