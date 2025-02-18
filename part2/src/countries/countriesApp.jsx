import {useState, useEffect} from 'react'
import countriesApi from './service/countries.js'
import './countries.css'

const Filter = ({onChange}) => {

  return (<div className={'filter-container'}>
    Find country/countries <input onChange={onChange}/>
  </div>)
}

const SingleCountry = ({country}) => {
  return (
    <div key={country.name} className="single-country">
      <h2> Name: {country.name} </h2>
      <h3> Capital: {country.capital} </h3>
      <h3> Area: {country.area} </h3>
      <h3>Languages:</h3>
      <ul>
        {country.languages.map(language =>
          <li key={language}> {language} </li>)}
      </ul>
      <img src={country.flag.png} alt={country.flag.alt}/>
    </div>
  )
}

const CountryList = ({countries, search, showCountry}) => {

  if (countries.length >= 10) {
    return `Too many matches, please specify another filter`
  }
// TODO: Make every key unique
  return (
    countries.some(country => country.name.toLowerCase().includes(search.toLowerCase())) ? countries.map(country =>
      <div className="list-country" key={country.name}>
        <p> {country.name} </p>
        <button value={country.name} onClick={showCountry}> show</button>
      </div>
    ) : null
  )
}

const CountryWeather = ({country}) => {

  const [temperature, setTemperature] = useState(null)
  const [wind, setWind] = useState(null)
  const [icon, setIcon] = useState(null)
  const [iconDescription, setIconDescription] = useState("")

  // weather api call and set state
  useEffect(() => {
    countriesApi.getWeather(country.lat, country.lon)
      .then(response => {
        setTemperature(response.main.temp)
        setWind(response.wind.speed)
        setIcon(response.weather[0].icon)
        setIconDescription(response.weather[0].description)
      })

  }, [])

  return (
    <div className="weather-container">
      <h3>Weather for {country.capital}</h3>
      <p>Temperature: {temperature}°C</p>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
           alt={iconDescription}/>
      <p>Wind: {wind} m/s</p>
    </div>
  )
}

const CountriesApp = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [countriesList, setCountriesList] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState("")

  useEffect(() => {
      countriesApi.getAllCountries()
        .then(listOfCountries => {
          const filteredList = listOfCountries.map(country => ({
            name: country.name.official, // OPTIONAL CHAINING WITH DEFAULT VALUE
            // The "capital?" is needed because the API returns null if
            // there is no capital
            capital: country.capital?.[0] || "No capital",
            area: country.area,
            languages: Object.values(country.languages || {}),
            flag: country.flags,
            lat: country.latlng[0],
            lon: country.latlng[1]
          }))
          setCountriesList(filteredList)
          countriesApi.create(filteredList)
        })
        .catch(error => {
          console.log(error)
        })
    }, []
  )

  const filterCountry = (e) => {
    const searchTerm = e.target.value
    setSelectedCountry(null)
    const searchFilter = searchTerm === '' ? [] : countriesList.filter(countriesList => countriesList.name.toLowerCase().includes(searchTerm))
    searchFilter.length === 1 ? setSelectedCountry(searchFilter[0]) : setFilteredCountries(searchFilter)
  }

  const showCountry = (e) => {
    const countryName = e.target.value;
    const selectedCountry = countriesList.filter(country => country.name === countryName);
    setSelectedCountry(selectedCountry[0])
    setFilteredCountries(null)
  }

  return (
    <div className="main-container">
      <h1>Countries</h1>
      <Filter onChange={filterCountry}/>
      {selectedCountry ? <>
          <SingleCountry country={selectedCountry}/>
          <CountryWeather country={selectedCountry}/>
        </>
        : <CountryList countries={filteredCountries} search={searchTerm}
                       showCountry={showCountry}/>}
    </div>)
}

export default CountriesApp