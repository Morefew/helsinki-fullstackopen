import CourseApp from './courseInfo/courseApp.jsx'
import PhonebookApp from './phonebook/phonebookApp.jsx'
import CountriesApp from './countries/countriesApp.jsx'
const App = () => {
  return(
    <div className="app-container">
      <CourseApp/>
      <PhonebookApp/>
      <CountriesApp/>
    </div>
  )
}

export default App