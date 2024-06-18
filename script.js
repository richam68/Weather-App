let searchSection = document.querySelector(".search-section");
let navSection = document.querySelector(".nav-section");
let userWeather = document.querySelector(".user-weather");
let searchWeather = document.querySelector(".search-weather");
let searchText = document.querySelector(".search-text");
let searchBtn = document.querySelector(".search-btn");
let weatherType = document.querySelector(".weather-type");
let weatherIcon = document.querySelector(".weather-icon");
let errorPage = document.querySelector(".error-page");
let loader = document.querySelector(".loading img");
let city = "";
const apiKey = "85814df256a3eed2f9c65fa6dea4a2a2";
let userWeatherList = userWeather.classList;
let searchWeatherList = searchWeather.classList;


async function fetchCustomWeatherDetail(lat, lon) {
  try {
    const api = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await api.json();
    renderWeatherInfo(data);
  } catch (error) {
    //handle error
    loader.style.display = "none";
    errorPage.style.display = "flex";
    navSection.style.display = "none";
    searchText.value = "";
  }
}

function getLocation() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geo-location not supported");
  }
}

async function showPosition(position) {
  console.log("inside position");
  let lat = position.coords.latitude;
  let longi = position.coords.longitude;
  console.log("got coords");
  loader.style.display = "block";
  navSection.style.display = "none";
  await fetchCustomWeatherDetail(lat, longi);
  loader.style.display = "none";
  navSection.style.display = "flex";
}

getLocation();

userWeather.addEventListener("click", () => {
  userWeatherList.add("btn-active");
  searchWeatherList.remove("btn-active");
  searchSection.style.display = "none";
  navSection.style.display = "none";
  getLocation();
  navSection.style.display = "flex";
  navSection.style.top = "0";
  errorPage.style.display = "none"; 
  
});

searchWeather.addEventListener("click", () => {
  userWeatherList.remove("btn-active");
  searchWeatherList.add("btn-active");
  searchSection.style.display = "flex";
  navSection.style.display = "none";
});

searchSection.addEventListener("click", () => {
  searchSection.style.display = "flex";
  navSection.style.display = "none";
});

searchBtn.addEventListener("click", renderSearchWeather);

searchText.addEventListener("keydown", async (ele) => {
  
  if (ele.key === "Enter") {
    await renderSearchWeather();
  }
});

async function renderSearchWeather() {
  try {
    errorPage.style.display = "none";
    navSection.style.display = "none"; 
    loader.style.display = "block";
    await fetchWeatherDetail();
    loader.style.display = "none";
    navSection.style.display = "flex";
    searchText.value = "";
    navSection.style.top = "-1.5rem";
    errorPage.style.display = "none"; 
  } catch (error) {
    loader.style.display = "none";
    errorPage.style.display = "flex"; 
    navSection.style.display = "none";
    searchText.value = "";
  }
}

async function renderWeatherInfo(data) {
  document.querySelector(
    ".weather-temperature"
  ).innerText = `${data.main.temp} °C`;
  document.querySelector(".city-name").innerText = `${data.name}`;
  document.querySelector(".windspeed").innerText = `${data.wind.speed} m/s`;
  document.querySelector(".humidity").innerText = `${data.main.humidity}%`;
  document.querySelector(".clouds").innerText = `${data.clouds.all}%`;
  let country = data.sys.country.toLowerCase();
  let flagSrc = await `https://flagcdn.com/256x192/${country}.png`;
  document.querySelector("#flag").src = flagSrc;
  let weatherDetails = data.weather[0];
  let iconId = weatherDetails.icon;
  //
  let iconSrc = await `http://openweathermap.org/img/w/${iconId}.png`;
  weatherIcon.src = iconSrc;
  weatherType.innerText = weatherDetails.main;
}

async function fetchWeatherDetail() {
  city = searchText.value.trim();
  const api = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );
  if (api.ok) {
    const data = await api.json();
    await renderWeatherInfo(data);
  } else {
    //  return Promise.reject("bhai error le")
    throw new Error("bhais ki error")
  }
}

