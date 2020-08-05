const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();
app.use(cors());
app.use(express.json());


const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {

    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  if (!isUuid(repository.id)) {
    response.status(400).json({ response: "Invalid uuid!" })
  }

  repositories.push(repository);

  return response.json(repository);
});

//Update repository
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ response: 'Project not found' });
  }
  const repositoryBackup = repositories[repositoryIndex];
  const repository = {
    id: repositoryBackup.id,
    title,
    url,
    techs,
    likes: repositoryBackup.likes,

  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);


  if (repositoryIndex < 0) {
    return response.status(400).json({ response: 'Project not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ response: 'Project not found' });
  }

  const repository = repositories[repositoryIndex]

  repository.likes += 1

  repositories[repositoryIndex] = repository;

  return response.json(repositories);
});

module.exports = app;
