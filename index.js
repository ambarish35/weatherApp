const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container")

const grantAcessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")

const API_KEY =  "9a8c274428f5a75c91d15c34d43562b6"
let currentTab = userTab
currentTab.classList.add("current-tab")

userTab.addEventListener('click', () => { switchTab(userTab)})

searchTab.addEventListener('click',()=>{
    switchTab(searchTab)
})

getfromSessionStorage()

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab")
        currentTab = clickedTab
        currentTab.classList.add("current-tab")

        if (searchForm.classList.contains("active")) {
            searchForm.classList.remove("active")
            userInfoContainer.classList.remove("active")
            getfromSessionStorage() 
        }
        else{
            
            userInfoContainer.classList.remove("active")
            grantAcessContainer.classList.remove("active")
            searchForm.classList.add("active")
        }
    }
    
}

//Check if Co-Ordinates are already present in Session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates")

    if(!localCoordinates){
        grantAcessContainer.classList.add("active")
    }
    else{
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon} = coordinates;
    grantAcessContainer.classList.remove("active")
    loadingScreen.classList.add("active")
    //API Call

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        const data = await response.json()
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
    }
    catch(error){
        loadingScreen.classList.remove("active")
        // alert("Couldn't get location, try searching your city name.")
    }
}

function renderWeatherInfo(weatherInfo){
    //fetch the elements to render

    const cityName = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryFlag]")
    const desc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const temp = document.querySelector("[data-temp]")
    const windspeed = document.querySelector("[data-windspeed]")
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness = document.querySelector("[data-cloudiness]")

    // now render to UI 
    if (weatherInfo?.name === undefined) {
        alert("City could not be found! Try using a different name.")
    }else{
        cityName.innerText = weatherInfo?.name
        desc.innerText = weatherInfo?.weather?.[0]?.description
        temp.innerText = `${weatherInfo?.main?.temp}°C`
        humidity.innerText = `${weatherInfo?.main?.humidity}%`
        windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`
        cloudiness.innerText = `${weatherInfo?.clouds?.all}%`
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
        weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    }
    

    

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    }
    else{
        alert("Geolocation is not supported by this browser.")
    }
}


function showPosition(position){

    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)
}


function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }

}
const grantAcessButton = document.querySelector("[data-grantAcess]")
grantAcessButton.addEventListener('click',getLocation)

const searchInput = document.querySelector("[data-searchInput]")
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const cityName = searchInput.value
    if( cityName === ""){
        return
    }
    else{
        fetchSearchWeatherInfo(cityName)
    }
})

async function fetchSearchWeatherInfo(cityName){
    loadingScreen.classList.add("active")
    userInfoContainer.classList.remove("active")
    grantAcessContainer.classList.remove("active")
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)
        const data = await response.json()
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
    }
    catch(error){
        console.log("Hierror")
        alert("Weather could not be found")
    }

}