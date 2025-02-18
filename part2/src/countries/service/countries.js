import axios from 'axios'

const restCountriesApiAll = `https://studies.cs.helsinki.fi/restcountries/api/all`

const apiKey = import.meta.env.VITE_WEATHER_APP
const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric&`
// https://api.openweathermap.org/data/2.5/weather?appid=d877aecb6f2e5e1aee6c963208ebc22d&units=metric&lat=19&lon=-70
// local cache with filtered data
const localCountries = 'http://localhost:3001/countries'

const getAllCountries = () => {
  const request = axios.get(restCountriesApiAll)

// this function returns just the data property of the response object
  return request.then(response => response.data)
}


const getWeather = (lat, lon) => {
  const apiAddress = weatherAPI + `lat=${lat}&lon=${lon}`
  const request = axios.get(apiAddress)
  return request.then(response => response.data )
}

const create = newObject => {
  return axios.post(localCountries, newObject)
}

export default {
  getAllCountries: getAllCountries, create: create, getWeather: getWeather
}