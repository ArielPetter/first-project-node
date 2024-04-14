//está sendo importado: / Apenas utilizando outra forma que não import express from 'express' por ex 
const express = require('express'); 
const uuid = require('uuid'); 
const cors = require("cors");
const port = 3001;

const app = express();
app.use(express.json())
app.use(cors())

/* forma de query params
app.get('/users', (request, response) => {
    
    const name = request.query.name;
    const age = request.query.age;
    / as variáveis acima tbm podem ser feitas:
    const {name, age} = request.query, se chama> destructuring assignment */

//return response.json({Name: name, Age: age}) // pode deixar apenas: ({name, age})
//})

/* forma de route params
app.get('/users/:id', (request, response) => {

    const {id}  = request.params

    console.log(id)

    return response.json({id})
}) */

const users = []

const checkUserId = (request, response, next) => { //middleware
    const {id} = request.params
    const index = users.findIndex(user => user.id === id)

    if(index < 0){
        return response.status(404).json({error: "User not found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}


app.get('/users', (request, response) => {
    return response.json(users)
})

app.post('/users', (request, response) => {
    const {name, age} = request.body
    const user = {id: uuid.v4(), name, age}

    users.push(user)
    return response.status(201).json(user)
})

app.put('/users/:id', checkUserId, (request, response) => {
    const {name, age} = request.body
    const id = request.userId
    const index = request.userIndex
    const updateUsers = {id, name, age}
    
    users[index] = updateUsers

    return response.json(updateUsers)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex
    users.splice(index, 1) //splice: permite eliminar um item do array com o id 

    return response.status(204).json() //204 deu certo mas n tem conteudo encontrado
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
})



