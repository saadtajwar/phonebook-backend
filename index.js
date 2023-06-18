require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
app.use(express.static('build'))
app.use(express.json())
const morgan = require('morgan')
app.use(morgan('tiny'))
const cors = require('cors')
app.use(cors())
const mongoose = require('mongoose')

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))
})


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

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const newPerson = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, newPerson, {new: true}).then(updatedPerson => {
        response.json(updatedPerson)
    }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}
  
  // this has to be the last loaded middleware.
app.use(errorHandler)  

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('Server running'))