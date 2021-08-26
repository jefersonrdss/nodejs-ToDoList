const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = []; // lista de usuarios cadastrados

// Middleware para verificar se usuario existe
function checksExistsUserAccount(request, response, next) {

    const { username } = request.headers; // pega o username do headers

    const user = users.find(user => user.username === username); // find user com username

    // caso não existir
    if (!user) {
        return response.status(400).json({ error: "User not found" })
    }

    request.user = user // inserindo o user dentro do request

    return next()
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
    
    const { user } = request
    return response.status(200).json(user.todos);
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