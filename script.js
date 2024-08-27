const apiKey = '834f764d7be31593842c35c586412807'; // Replace with your actual API key
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value;
        if (city) {
            getWeather(city);
        }
    }
});

async function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    console.log('Fetching weather for:', city);
    console.log('API URL:', apiUrl);

    try {
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('API response:', data);

        if (data.cod === '404') {
            alert('City not found. Please try again.');
            return;
        }

        displayWeather(data);
    } catch (error) {
        console.error('Detailed error:', error);
        alert('An error occurred while fetching weather data. Please check the console for more details.');
    }
}

function displayWeather(data) {
    const currentWeather = data.list[0];

    document.getElementById('city-name').textContent = data.city.name;
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

    // Show the weather info
    weatherInfo.style.display = 'block';
}

// Add this function to reset the view when the search is cleared
function resetView() {
    cityInput.value = '';
    weatherInfo.style.display = 'none';
    document.getElementById('landing-page').style.display = 'block';
}

// Add event listener for input changes
cityInput.addEventListener('input', function() {
    if (this.value === '') {
        resetView();
    }
});