const apiKey = '834f764d7be31593842c35c586412807'; // Replace with your actual API key
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const forecast = document.getElementById('forecast');

searchBtn.addEventListener('click', getWeather);

async function getWeather() {
    const city = cityInput.value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === '404') {
            alert('City not found. Please try again.');
            return;
        }

        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('An error occurred while fetching weather data. Please try again.');
    }
}

function displayWeather(data) {
    const currentWeather = data.list[0];

    cityName.textContent = data.city.name;
    temperature.textContent = `${Math.round(currentWeather.main.temp)}°C`;
    description.textContent = currentWeather.weather[0].description;

    forecast.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const dayData = data.list[i * 8];
        const date = new Date(dayData.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');
        forecastDay.innerHTML = `
            <p>${dayName}</p>
            <p>${Math.round(dayData.main.temp)}°C</p>
        `;
        forecast.appendChild(forecastDay);
    }
}