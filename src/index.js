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
        return response.status(404).json({ error: "User not found" });
    }

    request.user = user; // inserindo o user dentro do request

    return next();
}

// Cadastrar usuário
app.post('/users', (request, response) => {

    // dados da requisição
    const { name, username } = request.body;

    // Caso usuário já exista
    const userAlreadyExists = users.find(user => user.username === username);
    if (userAlreadyExists){
        return response.status(400).json({ error: "User already exists" });
    }

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

// buscar lista de todos
app.get('/todos', checksExistsUserAccount, (request, response) => {

    const { user } = request;
    return response.status(200).json(user.todos);
});

// Cadastrar todo
app.post('/todos', checksExistsUserAccount, (request, response) => {
    
    // dados do request
    const { user } =  request;
    const { title, deadline } = request.body;

    // criando o objeto todo
    const todo = {
        id: uuidv4(),
        title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date()
    };

    // inserindo todo
    user.todos.push(todo);

    return response.status(201).json(todo);
});

// Alterar todo
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    
    // dados da requisição
    const { user } = request;
    const { title, deadline } = request.body;
    const { id } = request.params;

    // buscar o todo com base no id
    const todo = user.todos.find(todo => todo.id === id);
    
    // caso não exista o todo
    if (!todo) {
        return response.status(400).json({ error: "Todo not found" });
    }

    // realizando a alteracao
    todo.title = title;
    todo.deadline = new Date(deadline);

    return response.status(200).json({ message: "Successfully altered todo" });
});

// Mudar status done todo
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
    
    // dados da requisição
    const { user } = request;
    const { id } = request.params;

    // buscar o todo com base no id
    const todo = user.todos.find(todo => todo.id === id);
    
    // caso não exista o todo
    if (!todo) {
        return response.status(400).json({ error: "Todo not found" });
    }

    // realizando a alteracao
    todo.done = true;

    return response.status(200).json({ message: "Successfully altered todo" });
});

// deletar todo
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
    
    // dados da requisicao
    const { user } = request;
    const { id } = request.params;

    // buscar todo pelo id
    const todo = user.todos.find(todo => todo.id === id);

    // remover todo
    user.todos.splice(user.todos.indexOf(todo), 1);

    return response.status(200).json({ message: "Todo successfully deleted" });
});

module.exports = app;