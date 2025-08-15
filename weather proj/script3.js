const API_KEY = "0751599ed20d67e5e2ac43c8f7684fcf"; 

// Elements
const weatherIcon = document.querySelector(".weatherIcon");
const temperature = document.querySelector(".temperature");
const feelsLike = document.querySelector(".feelslike");
const description = document.querySelector(".description");
const dateElem = document.querySelector(".date");
const cityElem = document.querySelector(".city");

const HValue = document.getElementById("Hvalue");
const WValue = document.getElementById("Wvalue");
const SRValue = document.getElementById("SRValue");
const SSValue = document.getElementById("SSValue");
const CValue = document.getElementById("Cvalue");
const UValue = document.getElementById("Uvalue");
const PValue = document.getElementById("Pvalue");

const forecastContainer = document.querySelector(".Forecast");
const unitSelector = document.getElementById("converter");

// Fetch weather data
async function fetchWeather(city, units="metric") {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) {
    alert("City not found!");
    return;
  }
  const data = await res.json();
  displayWeather(data, units);
  fetchForecast(city, units);
}

async function fetchForecast(city, units="metric") {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) return;
  const data = await res.json();
  displayForecast(data);
}

function displayWeather(data, units) {
  const tempUnit = units === "metric" ? "°C" : "°F";
  const cityName = data.name;
  const weatherDesc = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  temperature.textContent = `${Math.round(data.main.temp)}${tempUnit}`;
  feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}${tempUnit}`;
  description.textContent = weatherDesc;
  dateElem.textContent = new Date().toDateString();
  cityElem.textContent = cityName;

  HValue.textContent = `${data.main.humidity}%`;
  WValue.textContent = `${data.wind.speed} ${units === "metric" ? "m/s" : "mph"}`;
  SRValue.textContent = formatTime(data.sys.sunrise);
  SSValue.textContent = formatTime(data.sys.sunset);
  CValue.textContent = `${data.clouds.all}%`;
  PValue.textContent = `${data.main.pressure} hPa`;
  
  // OpenWeather free API doesn't give UV index directly
  UValue.textContent = "N/A"; 
}

function displayForecast(data) {
  forecastContainer.innerHTML = "";
  // 5-day forecast: pick one item per day (~ every 8 steps)
  for (let i = 0; i < data.list.length; i += 8) {
    const day = data.list[i];
    const date = new Date(day.dt * 1000);
    const temp = Math.round(day.main.temp);
    const icon = day.weather[0].icon;
    const desc = day.weather[0].description;

    const card = document.createElement("div");
    card.classList.add("day");
    card.innerHTML = `
      <h4>${date.toDateString().slice(0,10)}</h4>
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
      <p>${temp}${unitSelector.value === "metric" ? "°C" : "°F"}</p>
      <small>${desc}</small>
    `;
    forecastContainer.appendChild(card);
  }
}

function formatTime(unix) {
  const date = new Date(unix * 1000);
  return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Search function
function findUserLocation() {
  const city = document.getElementById("userlocation").value;
  const units = unitSelector.value;
  if (city.trim() !== "") {
    fetchWeather(city, units);
  }
}

// Update when unit changes
unitSelector.addEventListener("change", () => {
  const city = cityElem.textContent;
  if (city) fetchWeather(city, unitSelector.value);
});

// Load default city
window.onload = () => {
  fetchWeather("Bengaluru"); // Default city
};
