const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('add a password');
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://saadtajwar:${password}@cluster0.ca4ivqo.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(response => {
        response.forEach(person => {
            console.log(person);
        })
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    
    const newPerson = new Person({
        name,
        number
    })
    
    newPerson.save().then(response => {
        console.log('added new person');
        mongoose.connection.close()
    })
}

