import axios from 'axios'

const baseUrl = 'http://localhost:3001/person'
// const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
// this function returns just the data property of the response object
  return request.then(response => response.data)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default {
  getAll, create, update, deletePerson
}