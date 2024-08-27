const apiKey = '834f764d7be31593842c35c586412807'; // Replace with your actual API key
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

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

    document.getElementById('city-name').textContent = data.city.name;
    document.getElementById('temperature').textContent = `${Math.round(currentWeather.main.temp)}°`;
    document.getElementById('min-temp').textContent = `${Math.round(currentWeather.main.temp_min)}°`;
    document.getElementById('max-temp').textContent = `${Math.round(currentWeather.main.temp_max)}°`;
    document.getElementById('description').textContent = currentWeather.weather[0].description;
    
    const iconCode = currentWeather.weather[0].icon;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

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
            <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
            <p>${Math.round(dayData.main.temp_max)}/${Math.round(dayData.main.temp_min)}</p>
        `;
        forecast.appendChild(forecastDay);
    }

    // Hide landing page and show weather info
    document.getElementById('landing-page').style.display = 'none';
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

// Initial weather load (you can set a default city)
getWeather('Chandigarh');
