const apiKey = '834f764d7be31593842c35c586412807'; // Replace with your actual API key
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const landingPage = document.getElementById('landing-page');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        searchCity(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value;
        if (city) {
            searchCity(city);
        }
    }
});

async function searchCity(city) {
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    console.log('Searching for city:', city);
    console.log('API URL:', apiUrl);

    try {
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('API response:', data);

        if (data.length === 0) {
            alert('No cities found. Please try again.');
            return;
        }

        if (data.length === 1) {
            getWeather(data[0].lat, data[0].lon, data[0].name, data[0].country);
        } else {
            displayCityOptions(data);
        }
    } catch (error) {
        console.error('Detailed error:', error);
        alert('An error occurred while searching for the city. Please check the console for more details.');
    }
}

function displayCityOptions(cities) {
    const cityList = document.createElement('div');
    cityList.id = 'city-list';
    cityList.innerHTML = '<h3>Multiple cities found. Please select one:</h3>';

    cities.forEach(city => {
        const cityOption = document.createElement('div');
        cityOption.classList.add('city-option');
        cityOption.textContent = `${city.name}, ${city.state || ''} ${city.country}`;
        cityOption.addEventListener('click', () => {
            getWeather(city.lat, city.lon, city.name, city.country);
            cityList.remove();
        });
        cityList.appendChild(cityOption);
    });

    landingPage.appendChild(cityList);
}

async function getWeather(lat, lon, cityName, country) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    console.log('Fetching weather for:', cityName);
    console.log('API URL:', apiUrl);

    try {
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('API response:', data);

        displayWeather(data, cityName, country);
    } catch (error) {
        console.error('Detailed error:', error);
        alert('An error occurred while fetching weather data. Please check the console for more details.');
    }
}

function displayWeather(data, cityName, country) {
    const currentWeather = data.list[0];

    document.getElementById('city-name').textContent = `${cityName}, ${country}`;
    document.getElementById('temperature').textContent = `${Math.round(currentWeather.main.temp)}°`;
    document.getElementById('min-temp').textContent = `${Math.round(currentWeather.main.temp_min)}°`;
    document.getElementById('max-temp').textContent = `${Math.round(currentWeather.main.temp_max)}°`;
    document.getElementById('description').textContent = currentWeather.weather[0].description;
    
    const iconCode = currentWeather.weather[0].icon;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const forecast = document.querySelector('.forecast');
    forecast.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const dayData = data.list[i * 8];
        const date = new Date(dayData.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const iconCode = dayData.weather[0].icon;
        
        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');
        forecastDay.innerHTML = `
            <p>${dayName}</p>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
            <p>${Math.round(dayData.main.temp_max)}/${Math.round(dayData.main.temp_min)}</p>
        `;
        forecast.appendChild(forecastDay);
    }

    weatherInfo.style.display = 'block';
    landingPage.style.display = 'none';
}

function resetView() {
    cityInput.value = '';
    weatherInfo.style.display = 'none';
    landingPage.style.display = 'block';
    const cityList = document.getElementById('city-list');
    if (cityList) cityList.remove();
}

cityInput.addEventListener('input', function() {
    if (this.value === '') {
        resetView();
    }
});