require('dotenv').config()


const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


const morgan = require('morgan')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors())


app.get('/info', (request, response) =>{
    response.send(
        `<p>Phonebook has info for ${people.length} people</p>
        <p>${new Date()}</p>`
        )
})

app.get('/api/people/:id', (request, response)=>{
    Person.findById(request.params.id).then(person =>{
        response.json(person.toJSON())
    })
})
app.get('/api/people', (request, response)=>{
        Person.find({}).then(people =>{
            response.json(people.map(person => person.toJSON()))
        })
    
})

app.delete('/api/people/:id', (request, response, next)=>{
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/people', (request, response, next)=>{
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
    .catch(error=> next(error))
})


const errorHandler = (error, request, response, next) =>{
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
console.log(`Server running on port ${PORT}`)
})