// imports
const express = require("express");
const cors = require("cors");
const { isUuid, uuid } = require("uuidv4");

// inicializa o express
const app = express();

// middlewares: tratar body como json; usar cors
app.use(express.json());
app.use(cors());

// variável de memória, criada toda vez que inicia o app #NSFP (Non Safe For Production)
const repositories = [
  {
      "id": "ff521081-0c83-42ce-8bdc-2521549bbeca",
      "likes": 0,
      "url": "https://github.com/Rocketseat/umbriel",
      "title": "Umbriel",
      "techs": ["Node", "Express", "TypeScript"]
  },
  {
      "id": "77ea2377-18f3-4234-a5c6-99ec013042cd",
      "likes": 0,
      "url": "https://github.com/matheusgrigoletto/swift",
      "title": "Swift",
      "techs": ["Swift"]
  },
  {
      "id": "ce64e912-3910-4fa7-a100-aa398b85fb80",
      "likes": 0,
      "url": "https://github.com/matheusgrigoletto/flutter",
      "title": "Flutter",
      "techs": ["Flutter", "Dart"]
  },
  {
      "id": "23e35f84-3324-4319-94e7-ec25cccc2381",
      "likes": 0,
      "url": "https://github.com/matheusgrigoletto/react",
      "title": "React",
      "techs": ["React", "Javascript", "TypeScript"]
  },
  {
      "id": "5a743eab-5ece-4c7a-b517-3581f45df9db",
      "likes": 0,
      "url": "https://github.com/matheusgrigoletto/angular",
      "title": "Angular",
      "techs": ["Angular", "TypeScript"]
  },
];

/**
 * Middleware que gera ID e inicializa o número de likes
 * @param request
 * @param response
 * @param next
 */
function beforeCreteRepository(request, response, next) {
  request.body.id = uuid();
  request.body.likes = 0;

  return next();
}

/**
 * Middleware para validar o ID do repositório
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function validateUUID(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository ID." });
  }

  return next();
}

// GET: Lista repositórios
app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

// POST: Criar repositórios
app.post("/repositories", beforeCreteRepository, (request, response) => {
  const { id, url, title, techs, likes } = request.body;

  const repo = { id, url, title, techs, likes };

  repositories.push(repo);

  return response.status(200).json(repo);
});

// Usar middleware para validar UUID
app.use("/repositories/:id", validateUUID);

// PUT: Atualizar dados do repositório
app.put("/repositories/:id", (request, response) => {
  const { url, title, techs } = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  const repoUpdatedData = {
    ...repositories[repoIndex],
    url: url || repositories[repoIndex].url,
    title: title || repositories[repoIndex].title,
    techs: techs || repositories[repoIndex].techs,
  };

  repositories[repoIndex] = repoUpdatedData;

  return response.json(repoUpdatedData);
});

// DELETE: Excluir repositório
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

// POST: Aumentar número de likes de um repositório em 1
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories[repoIndex].likes = repositories[repoIndex].likes + 1;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
