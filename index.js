require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
app.use(express.json())
const morgan = require('morgan')
app.use(morgan('tiny'))
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
const mongoose = require('mongoose')

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(p => p.id !== id)
//     response.status(204).end()
// })


app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({error: 'Need name and number'})
    }

    const {name, number} = body

    const newPerson = new Person({name, number})
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('Server running'))