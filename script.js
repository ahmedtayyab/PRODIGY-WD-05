const apiKey = "5670feeb2e15a0bdada2ec45f2344316";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
const geoDbApiUrl = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const suggestionsBox = document.querySelector(".suggestions");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    const data = await response.json();
    console.log(data);

    if (data.cod === 200) {
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + " %";
        document.querySelector(".wind").innerHTML = data.wind.speed + " Km/h";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        }
    } else {
        document.querySelector(".city").innerHTML = "City not found";
        document.querySelector(".temp").innerHTML = "";
        document.querySelector(".humidity").innerHTML = "";
        document.querySelector(".wind").innerHTML = "";
    }
}

async function suggestCities(query) {
    const response = await fetch(`${geoDbApiUrl}?namePrefix=${query}`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '76a4c9cfd4msha048ee19767dedfp153717jsn5fef423126e8',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    });
    const data = await response.json();
    console.log(data);

    suggestionsBox.innerHTML = "";

    if (data.data) {
        data.data.forEach(city => {
            const suggestionItem = document.createElement("p");
            suggestionItem.textContent = city.city;
            suggestionItem.addEventListener("click", () => {
                searchBox.value = city.city;
                suggestionsBox.innerHTML = "";
                checkWeather(city.city);
            });
            suggestionsBox.appendChild(suggestionItem);
        });
    }
}

function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}

searchBox.addEventListener("input", debounce(() => {
    const query = searchBox.value;
    if (query) {
        suggestCities(query);
    } else {
        suggestionsBox.innerHTML = "";
    }
}, 300));

searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const city = searchBox.value;
        suggestionsBox.innerHTML = "";
        checkWeather(city);
    }
});

searchBtn.addEventListener("click", () => {
    const city = searchBox.value;
    suggestionsBox.innerHTML = "";
    checkWeather(city);
});

checkWeather("istanbul"); //DEFAULT CITY
