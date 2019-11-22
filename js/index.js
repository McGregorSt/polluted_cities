// import jsonp from 'jsonp'
// const cityEndpoint = 'https://api.openaq.org/v1/cities'
// const countryEndpoint = 'https://api.openaq.org/v1/countries'
const measuresEndpoint = 'https://api.openaq.org/v1/measurements'
const wikiEndpoint = 'https://www.wikipedia.org/w/api.php'

const searchBar = document.querySelector('.search')
const searchMatches = document.querySelector('.searchMatches')
const cityList = document.querySelector('.cityList')
const cityDesc = document.querySelector('.show')

const date = new Date()
const dateFromTo = date.toISOString().slice(0, 10)
const countries = ['Poland', 'Germany', 'Spain', 'France']

let selection = ''

const matchedCountries = (searchedCountry, countries) => {
  const regexp = new RegExp(searchedCountry, 'gi')
  return countries.filter(country => {
    return country.match(regexp)
  })
}

const showMatches = ev => {
  searchMatches.style = 'display: block;'
  const matched = matchedCountries(ev.target.value, countries)
  const renderSuggestions = matched
    .map(country => {
      return `
      <li>
      <div class='country'>${country}</div>
      </li>`
    })
    .join('')
  searchMatches.innerHTML = renderSuggestions
  if (ev.target.value === matched[0]) {
    searchMatches.style = 'display: none'
    selection = searchBar.value
    return selection
  }
}

if (localStorage.getItem('selectedCountry')) {
  console.log('here')
  selection = localStorage.getItem('selectedCountry')
  searchBar.value = selection
}

const selectMatch = ev => {
  searchBar.value = ''
  selection = ev.target.innerHTML
  localStorage.setItem('selectedCountry', selection)
  searchMatches.value = selection

  // const selection = ev.target.innerHTML
  searchBar.value = selection
  country = selection
  searchMatches.style = 'display: none'
  return selection
}

searchBar.addEventListener('input', showMatches)
searchMatches.addEventListener('click', selectMatch)

const getMeasures = async () => {
  const countryCode = () => {
    switch (selection) {
      case 'Poland':
        return 'PL'
      case 'Germany':
        return 'DE'
      case 'Spain':
        return 'ES'
      case 'France':
        return 'FR'
      default:
        return selection
    }
  }
  let mostPolluted = []
  await fetch(
    `${measuresEndpoint}?country=${countryCode()}&parameter=pm25&limit=10000&date_from=${dateFromTo}&date_to=${dateFromTo}&order_by=value`
  )
    .then(blob => blob.json())
    .then(data => {
      mostPolluted = data.results.reverse().slice(0, 10)

      let topTenCity = []

      mostPolluted.forEach(city => {
        topTenCity.push(city.city)
        return topTenCity
      })

      const renderCities = mostPolluted
        .map(city => {
          return `
          <li class='oneCity'>
          <div class='cityMain'>
                <strong> ${city.city} </strong>
                <span> PM 2.5: ${city.value.toFixed(2)} ${city.unit} </span>
                </div>
              <div class='cityDesc'>
              </div>
              </li>`
        })
        .join('')

      const cityListHeader = `<h1>Top 10 most polluted cities in ${selection} on ${dateFromTo}</h1>
                  <ul class="cityList"></ul>`

      document.querySelector('.mainView').innerHTML = cityListHeader
      document.querySelector('.cityList').innerHTML = renderCities
      let renderedCities = document.querySelectorAll('.cityList li')
      renderedCities.forEach((city, ind) => {
        return city.addEventListener('click', () => {
          let lastOpen = document.querySelector('.show')
          city.classList.toggle('accor')
          city.children[1].classList.toggle('show')
          if (lastOpen) {
            lastOpen.parentElement.classList.remove('accor')
            lastOpen.classList.remove('show')
          }
          getCityDesc(topTenCity[ind])
        })
      })
    })
}

searchMatches.addEventListener('click', getMeasures)
searchBar.addEventListener('blur', getMeasures)

// https://www.wikipedia.org/w/api.php?action=query&titles=Jawor&format=json&origin=*

const getCityDesc = async city => {
  const query = `?action=opensearch&search=${city}`
  console.log('city', city)
  await $.ajax({
    url: `${wikiEndpoint}${query}`,
    dataType: 'jsonp',
    method: 'GET',
  })
    .done(resp => {
      cityDescription = resp[2][0]
      let foo = document.querySelector('.cityDesc.show')
      console.log(foo)
      document.querySelector('.cityDesc.show').innerHTML = cityDescription
      return cityDescription
    })
    .fail(err => {
      return err
    })
}
