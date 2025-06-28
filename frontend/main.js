const baseUrl = "http://localhost:3001";
const tabelaBody = document.querySelector("#tabela-alunos tbody");
const form = document.getElementById("form-aluno");
const btnCancelar = document.getElementById("btn-cancelar");
const formTitle = document.getElementById("form-title");

const $ = (id) => document.getElementById(id);

function linhaAluno(aluno) {
  return `
    <tr>
      <td>${aluno.id}</td>
      <td>${aluno.nome}</td>
      <td>${aluno.apelido}</td>
      <td>${aluno.curso}</td>
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
  const resp = await fetch(`${baseUrl}/alunos`);
  const alunos = await resp.json();
  tabelaBody.innerHTML = alunos.map(linhaAluno).join("");
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
    body: JSON.stringify({ id, ...dados }),
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
    const linha = e.target.closest("tr").children;
    $("aluno-id").value = id;
    $("nome").value = linha[1].textContent;
    $("apelido").value = linha[2].textContent;
    $("curso").value = linha[3].textContent;
    $("ano").value = linha[4].textContent;
    $("idade").value = linha[5].textContent !== "-" ? linha[5].textContent : "";
    formTitle.textContent = "Editar aluno";
    btnCancelar.style.display = "inline";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dados = {
    nome: $("nome").value.trim(),
    apelido: $("apelido").value.trim(),
    curso: +$("curso").value,
    anoCurricular: +$("ano").value,
    idade: $("idade").value ? +$("idade").value : undefined,
  };
  const id = $("aluno-id").value;
  id ? await atualizarAluno(id, dados) : await criarAluno(dados);
  form.reset();
  $("aluno-id").value = "";
  formTitle.textContent = "Adicionar aluno";
  btnCancelar.style.display = "none";
  listarAlunos();
});

btnCancelar.addEventListener("click", () => {
  form.reset();
  $("aluno-id").value = "";
  formTitle.textContent = "Adicionar aluno";
  btnCancelar.style.display = "none";
});

listarAlunos();
