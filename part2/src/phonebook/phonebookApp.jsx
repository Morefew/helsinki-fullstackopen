import './phonebook.css'
import {useState, useEffect} from 'react'
import pbService from './service/phonebook.js'

const Filter = ({onChange}) => {

  return (<div className={'filter-container'}>
    filter shown with <input onChange={onChange}/>
  </div>)
}

const PersonForm = ({
                      name,
                      phone,
                      setPhone,
                      setName,
                      onUpdatePerson,
                      onAddPerson,
                      prevId
                    }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (prevId) {
      onUpdatePerson(e);
    } else {
      onAddPerson(e);
    }
  };

  return (<form onSubmit={handleSubmit}>
    <div className='person-form-container'>
      <h3>Create a contact</h3>
      name: <input value={name}
                   onChange={e => {
                     setName(e.target.value)
                   }}/>
      phone: <input value={phone}
                    onChange={e => setPhone(e.target.value)}/>
      {/*<div>*/}
      <button type="submit">{prevId ? "Update" : "Save"} Contact</button>
      {/*</div>*/}
    </div>
  </form>)
}

const PersonList = ({person, filteredPerson, onDeletePerson, onSelectPerson}) => {

  const title = filteredPerson.length === 0 ? 'Number\'s List' : 'Filtered Numbers'
  const list = filteredPerson.length === 0 ? person : filteredPerson

  return (
    <>
      <h3>{title}</h3>
      <div className={'person-list-container'}>
        {list.map(person =>
          <div key={person.id}>
            <div className='person-name'>{person.name} </div>
            <div className='person-phone'>{person.phone}</div>
            <div className={'person-list-container-buttons'}>
              <button onClick={() => onDeletePerson(person)}
                      className={'btn-delete'}>
                Delete
              </button>
              <button onClick={() => onSelectPerson(person)}
                      className={'btn-select'}>
                Select
              </button>
            </div>
          </div>)}
      </div>
    </>);
}

const Notification = ({message, style}) => {
  const errorStyle = style === true ? 'error' : 'success'
  if (message === null) {
    return null
  }
  return <div className={errorStyle}>{message}</div>
}

const PhonebookApp = () => {
  const [personList, setPersonList] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [prevId, setPrevId] = useState(0)
  const [filteredPerson, setFilteredPerson] = useState([])
  const [refreshList, setRefreshList] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState(null)

  useEffect(() => {
    pbService.getAll()
      .then(response => {
        setPersonList(response)
      })
      .catch(error => {
        console.log(`Error loading the phonebook: ${error.message}`)
        console.log('Error stack: ', error.stack)


      })
  }, [refreshList])

  if (!personList) {
  console.log('personList is not loaded yet')
    return null
  }

  function errorDelay(delay) {
    const secs = delay || 5000
    setTimeout(() => {
      setErrorMessage(null)
    }, secs)
  }

  const addPerson = (e) => {
    e.preventDefault()
    const personObject = {
      name: newName, phone: newNumber
    }
    if (personList.some(person => person.name === newName)) {
      setNotificationStyle(true)
      setErrorMessage(`${newName} already exists in the phonebook`)
      errorDelay()
      setNewName('')
      setNewNumber('')
      return
    }
    pbService.create(personObject)
      .then(() => {
        setNotificationStyle(false)
        setErrorMessage(`${newName} added to the phonebook`)
        errorDelay()
        setRefreshList((prev) => !prev)
      })
      .catch(error => {
        setNotificationStyle(true)
        setErrorMessage(`Error adding new person: ${newName}`)
        console.log(`Error adding new person: ${newName} ${error.message}`)
      })
    setNewName('')
    setNewNumber('')
  };

  const updatePerson = (e) => {
    e.preventDefault()
    const updatedPerson = {
      name: newName, phone: newNumber, id: prevId
    }
    if (window.confirm(
      `${newName} already exists in the phonebook. Do you want to update their number?`
    )) {
      pbService.update(updatedPerson.id, updatedPerson)
        .then(response => {
          setNotificationStyle(false)
          setErrorMessage(`Person ${newName} updated`)
          errorDelay()
          setRefreshList((prev) => !prev)
          setNewName('')
          setNewNumber('')
          setPrevId(0)
        })
        .catch(error => {
          console.log(`Error updating person: ${newName} ${error.message}`)
          setNotificationStyle(true)
          setErrorMessage(`Information of ${newName} has been already removed from the server`)
          errorDelay()
          setNewName('')
          setNewNumber('')
          setPrevId(0)
        })
    } else {
      console.log(`Updating ${newName} cancelled`)
      setNotificationStyle(true)
      setErrorMessage(`Updating ${newName} cancelled`)
      errorDelay()
      setRefreshList((prev) => !prev)
      setNewName('')
      setNewNumber('')
      setPrevId(0)
    }
  }

  const selectPerson = (person) => {
    if (!person || Object.keys(person).length === 0) {
      console.log("No person found")
      return;
    }
    setNewName(person.name)
    setNewNumber(person.phone)
    setPrevId(person.id)
  }

  const filterPerson = (e) => {
    const searchTerm = e.target.value.toLowerCase()
    const searchFilter = searchTerm === '' ? [] : personList.filter(person => person.name.toLowerCase().includes(searchTerm))
    setFilteredPerson(searchFilter)
  }

  const deletePerson = (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      console.log(`Deleting ${person.name}`)
      pbService.deletePerson(person.id)
        .then(() => {
          console.log('Person deleted')
          setNotificationStyle(false)
          setErrorMessage(`Person ${person.name} deleted`)
          errorDelay()
          setRefreshList((prev) => !prev)
        })
        .catch(error => {
          console.log(`Error deleting person: ${person.name} ${error.message}`)
          setNotificationStyle(true)
          setErrorMessage(`Error deleting person: ${newName}`)
          errorDelay()
        })
    } else {
      console.log(`Deleting ${newName} cancelled`)
      setNotificationStyle(true)
      setErrorMessage(`Deleting ${newName} cancelled`)
      errorDelay()
      setRefreshList((prev) => !prev)
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <div className="main-container">
      <h1>Phonebook</h1>
      <Notification message={errorMessage} style={notificationStyle}/>
      <Filter onChange={filterPerson}/>
      <PersonForm
        name={newName}
        phone={newNumber}
        setName={setNewName}
        setPhone={setNewNumber}
        onAddPerson={addPerson}
        onUpdatePerson={updatePerson}
        prevId={prevId}
      />
      <PersonList
        person={personList}
        filteredPerson={filteredPerson}
        onDeletePerson={deletePerson}
        onSelectPerson={selectPerson}
      />
    </div>)
}

export default PhonebookApp