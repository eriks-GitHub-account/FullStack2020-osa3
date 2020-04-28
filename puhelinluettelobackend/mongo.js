const mongoose =  require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const nameIn = process.argv[3]
const numberIn = process.argv[4]


const url = `mongodb+srv://fullstack:${password}@cluster0-kdxvm.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: nameIn,
    number: numberIn,
})

if (process.argv.length == 3) {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(person.name + " " + person.number)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length == 5) {
    person.save().then(response => {
        console.log(`added ${nameIn} number ${numberIn} to phonebook`)
        mongoose.connection.close()
    })
}

