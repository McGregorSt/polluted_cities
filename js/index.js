const cityEndpoint = 'https://api.openaq.org/v1/cities'
const countryEndpoint = 'https://api.openaq.org/v1/countries'

const getCountries = async () => {
  try {
    const response = await fetch(`${countryEndpoint}`)
    const fetchedData = await response.json()
    return fetchedData
  } catch (err) {
    console.log(err)
  }
}

const getCities = async (country, limit) => {
  try {
    const response = await fetch(`${cityEndpoint}${country}${limit}`)
    const fetchedData = await response.json()
    return fetchedData
  } catch (err) {
    console.log(err)
  }
}

let searchedCountry = []

getCountries().then((fetchedData) => {
  const countries = fetchedData.results
  console.log(countries)
  let selectedCountry = countries.filter(elm => elm.name === 'Poland')
  searchedCountry = [...searchedCountry, selectedCountry[0].code]
  return searchedCountry
}) .then(() => console.log(searchedCountry[searchedCountry.length - 1]))
  .then(
    getCities('?country=PL', '&limit=1000').then((fetchedData) => {
      const cities = fetchedData.results
      console.log('cricova', cities)
    
    })
  )




const cityInput = document.querySelector('.cityInput input')
const countrySearch = cityInput.addEventListener('input', (ev) => {
  return ev.target.value
})

const matchResults = () => {
  const citiesArr = getCities()
}