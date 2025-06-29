# Trabalho Prático #1: Consumo e Implementação de APIs RESTful

**Este guia mostra como configurar, executar localmente e testar o meu projeto, além de um breve resumo das tentativas de deploy.**

Autor: Pedro Barreto, 31661

---

## 1. Visão Geral

- **mock-data/**: dados iniciais em JSON (`bd.json`).
- **mock-server/**: API simulada com JSON-Server.
- **frontend/**: interface web (HTML/CSS/JS) com Fetch API.
- **backend/**: API real em Node.js + Express + MongoDB Atlas.
- **tests/**: coleção Postman para testes automáticos.

---

## 2. Pré-requisitos

- **Node.js** (versão LTS, v16+)
- **npm** (instalado com o Node.js)
- **VS Code** com extensão **Live Server**
- **Conta no MongoDB Atlas**&#x20;

---

## 3. Instalação e Execução Local

### 3.1. Descrição da bd

A base de dados inicial (em mock-data/bd.json) tem duas coleções:

alunos: cada registro inclui

   id (string) — identificador único no mock

   nome, apelido (strings)

   curso (número) — referencia o id de um curso

   anoCurricular (número)

   idade (número)

cursos: cada registro inclui

   id (número) — identificador único

   nomeCurso (string) — designação do curso

### 3.2. Clone do Repositório

```bash
git clone https://github.com/<user>/trab1-restapi-PB756.git
cd trab1-restapi-PB756
```

### 3.3. Mock Server (JSON-Server)

```bash
cd mock-server
npm install
npm run start        # roda em http://localhost:3000
```

- Teste CRUD de alunos e leitura de cursos via `http://localhost:3000/alunos` e `/cursos`.

### 3.4. Backend Real

```bash
cd ../backend
npm install
# Crie um arquivo .env com:
# PORT=4000
# MONGODB_URI=<sua-uri-atlas>
npm run seed         # popula MongoDB Atlas
npm run dev          # inicia API em http://localhost:4000/api
```

- Endpoints disponíveis: `/api/alunos`, `/api/cursos`, etc.

### 3.5. Frontend com Live Server

1. Abra **VS Code** na pasta `frontend`:
   ```bash
   cd ../frontend
   code .
   ```
2. Instale a extensão **Live Server**.
3. No **Explorer**, clique com o botão direito em `index.html` → **Open with Live Server**.
4. Acesse no browser:

      Deve abrir sozinho mas se não abir:
   ```text
   http://127.0.0.1:5500/frontend/index.html
   ```
5. A interface web será carregada e fará fetch para `http://localhost:4000/api` automaticamente.

```bash


```

---

## 4. Testes com Postman

1. Abra o **Postman**.
2. Importe `tests/postman-collection.json`.
3. Crie um **Environment** com:
   - `baseUrl = http://localhost:4000/api`
4. Utilize o **Runner** para executar todos os requests em sequência:
   - **Listar** → capta IDs → **Obter/Atualizar/Apagar**.

> ```js
> const alunos = pm.response.json();
> if (alunos.length) pm.environment.set("firstAlunoId", alunos[0].id);
> ```
>
> Usei este codigo para ter id dinâmico e usei `{{firstAlunoId}}` nas requests subsequentes.

---

## 5. Deploy (Tentativas)

- **Frontend (Vercel)**:

  - Configurado para pasta `frontend`.
  - **Status**: dropdown e CRUD local funcionam, mas em produção não carregava `GET /api` (sem backend online).

- **Backend (Render)**:

  - Apontado `root directory = backend`.
  - Variável `MONGODB_URI` configurada.
  - **Status**: API online em `https://trab1-restapi-pb756.onrender.com/api`.




