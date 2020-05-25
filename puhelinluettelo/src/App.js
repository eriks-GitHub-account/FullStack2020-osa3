import React, { useState, useEffect } from 'react'
import personService from './services/people'

const Filter = ({handleFilter},{filter})=>{
  return(
  <div>
  filter shown with: <input value={filter}
  onChange ={handleFilter}/>
</div>
)}

const PersonForm = (props)=>{
  return(
  <form onSubmit={props.addPerson}>
  <div>
    name: <input value={props.newName}
    onChange ={props.handleName}/>
  </div>
  <div>
    number: <input value={props.newNumber} 
    onChange={props.handleNumber}/></div>
  <div>
    <button type="submit">add</button>
  </div>
</form>
  )}

  const People = ({person, deleteP})=>{
    return(
      <li>
        {person.name} {person.number}
        <button onClick={deleteP}>Delete</button>
      </li>
    )
  }

  const Notification = ({message, type}) =>{
    if(message === null){
      return null
    }
    if(type === 'error'){
    return (
      <div className='error'>
        {message}
      </div>
    )
    }
    return (
      <div className='success'>
        {message}
      </div>
    )
  }



const App = () => {

  const [people, setPeople] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(()=>{
    personService
      .getAll()
      .then(response=>{
        setPeople(response.data)
      })
  }, [])

  const addPerson = (event) =>{
    event.preventDefault()
    const personObject = {
      name : newName,
      number : newNumber
    }
    if(people.some(a=>a.name === newName)){
      window.alert(`${newName} is already added to phonebook`)
    }else{
      personService
        .create(personObject)
        .then(response =>{
          setPeople(people.concat(response.data))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(
            `${personObject.name} added to phonebook`
          )
          setTimeout(()=>{
            setSuccessMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (id, name) =>{
    const confirmation = window.confirm(`Delete ${name}?`)

    if(confirmation === true){
    const removedPerson = people.find(p => p.id === id)
    personService
      .remove(id, removedPerson)
      .then( 
        setPeople(people.filter(p => p.id !== id)),
        setSuccessMessage(
          `${name} removed from phonebook`
        ),
        setTimeout(()=>{
          setSuccessMessage(null)
        }, 5000)
      )
      .catch(error=> {
        setErrorMessage(
          `${name} was already removed from server`
        )
        setTimeout(()=>{
          setErrorMessage(null)
        }, 5000)
        setPeople(people.filter(p => p.id !== id))
      })
    }
  }


  const handleNameChange = (event) =>{
    setNewName(event.target.value)
  }  

  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value)
  }  
  
  const handleFilterChange = (event) =>{
    setFilter(event.target.value)
  }
  const namesToShow = (filter==="")
    ? people
    : people.filter(person => person.name.toUpperCase().includes(filter.toUpperCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {errorMessage} type='error'/>
      <Notification message = {successMessage} type='success'/>
      <Filter handleFilter = {handleFilterChange} filter={filter}/>
      <h2>Add a new</h2>
      <PersonForm addPerson = {addPerson} newName={newName}
      handleName={handleNameChange} newNumber={newNumber}
      handleNumber={handleNumberChange}/>
      <h2>Numbers</h2> 
      {namesToShow.map((person)=>
      <People key={person.id}
      person = {person}
      deleteP ={()=>deletePerson(person.id, person.name)}
      />
      )} 
    </div>
  )

}

export default App
