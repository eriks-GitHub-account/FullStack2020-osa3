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

app.delete('/api/people/:id', (request, response)=>{
    const id = Number(request.params.id)
    people = people.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/people', (request, response)=>{
    const body = request.body

    if(body.name === undefined){
        return response.status(400).json({
            error: 'name missing'
        })
    }  
    if(body.number === undefined){
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
console.log(`Server running on port ${PORT}`)
})