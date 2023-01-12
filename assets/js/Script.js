var searchCityInput = document.querySelector("#inputCity")
var searchForm = document.querySelector("#search-form")
var cityLat = ""
var cityLong = ""
var todayName = document.querySelector("#today-name")
var todayDate = document.querySelector("#today-date")
var todayWeather = document.querySelector("#today-weather")
var todayTemp = document.querySelector("#today-temp")
var todayWind = document.querySelector("#today-wind")
var todayHumidity = document.querySelector("#today-humidity")
var buttonContainer = document.querySelector('#button-container')
// city will = whatever tey put in tthe search bar
setPastSearches()

function setPastSearches(){
    for (let i = 0; i<localStorage.length;i++){
        var pastSearches = document.createElement('button')
        pastSearches.textContent = localStorage.key(i)
        buttonContainer.append(pastSearches)
        pastSearches.addEventListener('click',()=>{
            searchWeather(pastSearches.textContent)
        })
        
    }
}
function searchWeather(cityToSearch){
    fetch (`https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=7d7c0e8b5ef6dabfe82ee5b8f7bee962&units=imperial`).then(function(res){
        return res.json()

    }).then(function(data){
        console.log(`search for ${cityToSearch}`)
        console.log(data)
        // appending today's weather
        todayName.textContent = data.name
        var date = dayjs().format('MMM DD, YYYY');
        todayDate.textContent = `Date: ${date}`
        todayWeather.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`
        todayTemp.textContent = `Weather: ${data.main.temp}°F`
        todayWind.textContent = `Wind Speed: ${data.wind.speed} Knots`
        todayHumidity.textContent = `Humidity: ${data.main.humidity}`


        // getting lat and long for 5 day forecast
        cityLat = data.coord.lat
        cityLong = data.coord.lon
        console.log(cityLat)
        console.log(cityLong)
        inputResults(cityLat,cityLong)
    })
}
// function that takes lat and long and makes new elements based on 5 day api results
function inputResults(cityLat,cityLong){
    fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLong}&appid=7d7c0e8b5ef6dabfe82ee5b8f7bee962&units=imperial`).then(function(res){
        return res.json()
    }).then(function(data){
        console.log(data)
        var forecastContainer = document.querySelector('#dayForecast')
        forecastContainer.innerHTML = ""
        // uses +8 because api gives 40 results for 5 days
        for (let i = 0; i<data.list.length; i = i + 8){
            console.log(data.list[i])
            var forecastDiv = document.createElement('div')
            forecastDiv.setAttribute("class", "col-2 card")
            forecastDiv.innerHTML =
            `<ul class= "list-group list-group-flush"> 
            <li class="list-group-item">Date: ${data.list[i].dt_txt} </li> 
            <li class="list-group-item"> <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png">  </li> 
            <li class="list-group-item"> Temp: ${data.list[i].main.temp}</li> 
            <li class="list-group-item"> Wind: ${data.list[i].wind.speed} MPH </li> 
            <li class="list-group-item"> Humidity: ${data.list[i].main.humidity}</li></ul>`
            forecastContainer.append(forecastDiv)
        }
        // appending 5 day forecast


    })



}
// event listener for submitting the city and runs appropriate functions
// creates a button containing information from previous searches
searchForm.addEventListener("submit",function(e){
    e.preventDefault();
    var pastCitySearched = document.createElement('button')
    pastCitySearched.setAttribute("class", "search-result-button")
    pastCitySearched.textContent = searchCityInput.value
    localStorage.setItem(`${searchCityInput.value}`,`${searchCityInput.value}`)
    console.log(searchCityInput.value)
    var cityToSearch = searchCityInput.value
    buttonContainer.append(pastCitySearched)
    searchWeather(cityToSearch)
})
