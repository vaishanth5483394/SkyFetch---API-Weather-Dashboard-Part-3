// 🔑 Replace with your actual OpenWeather API key
const API_KEY = "8af363c02f82071481bb83a9ffd438dc";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");

// Show Loading Spinner
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather data...</p>
        </div>
    `;
}

// Show Error Message
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>❌ Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Display Weather Data
function displayWeather(data) {
    weatherDisplay.innerHTML = `
        <div class="weather-card">
            <h2>${data.name}</h2>
            <p>🌡️ Temperature: ${data.main.temp}°C</p>
            <p>🌥️ Condition: ${data.weather[0].description}</p>
            <p>💧 Humidity: ${data.main.humidity}%</p>
        </div>
    `;

    // Focus back to input for better UX
    cityInput.focus();
}

// Fetch Weather (Async/Await)
async function getWeather(city) {

    showLoading();

    // Disable button while loading
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        displayWeather(response.data);

    } catch (error) {

        if (error.response && error.response.status === 404) {
            showError("City not found. Please check the spelling.");
        } else {
            showError("Something went wrong. Please try again later.");
        }

    } finally {
        // Re-enable button
        searchBtn.disabled = false;
        searchBtn.textContent = "🔍 Search";
    }
}

// Button Click Event
searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    if (city.length < 2) {
        showError("City name must be at least 2 characters.");
        return;
    }

    getWeather(city);
    cityInput.value = "";
});

// Enter Key Support
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});