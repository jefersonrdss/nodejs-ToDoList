const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = []; // lista de usuarios cadastrados

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
}

// Cadastrar usuário
app.post('/users', (request, response) => {

    const { name, username } = request.body; // dados da requisição

    // objeto do novo usuario
    const newUser = {
        id: uuidv4(),
        name,
        username,
        todos: []
    };

    users.push(newUser); // adicionando novo usuario

    return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;