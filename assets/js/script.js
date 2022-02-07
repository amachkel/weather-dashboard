let initSearchButtons = () => {
  let localStorageCities = localStorage.getItem("SearchedCities");
  let cities = [];

  if (localStorageCities != null) {
    cities = JSON.parse(localStorageCities);
  }
  for (let i = 0; i < cities.length; i++) {
    renderSearchBtn(cities[i]);
  }
};

let eventHandler = () => {
  let searchButtonEl = document.getElementById("searchBtn");
  searchButtonEl.addEventListener("click", getSearchInput);
};

let getSearchInput = (e) => {
  e.preventDefault();

  let cityName = document.getElementById("searchInput").value;
  if (cityName == "" || cityName == null) {
    return;
  }
  let localStorageCities = localStorage.getItem("SearchedCities");
  let cities = [];

  if (localStorageCities != null) {
    cities = JSON.parse(localStorageCities);
  }

  if (!cities.includes(cityName)) {
    cities.push(cityName);
    renderSearchBtn(cityName);
    localStorage.setItem("SearchedCities", JSON.stringify(cities));
    getCoordinates(cityName);
  }
};

let renderSearchBtn = (cityName) => {
  let searchHistoryEl = document.getElementById("search-history");
  let searchHistoryBtn = document.createElement("button");
  searchHistoryBtn.textContent = cityName;

  searchHistoryBtn.classList.add("btn", "btn-secondary", "btn-lg", "btn-block");

  searchHistoryEl.append(searchHistoryBtn);
};

let getCoordinates = (cityName) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=585ba3d2e5d78c9afea8cfd73fcf8a69`
  )
    .then((response) => response.json())
    .then((data) => {
      //Needs to be fixed
      if (data.cod != null && data.cod == "404") {
        let noResultsMsg = document.createElement("h3");
        //I defined currentWeatherEl in 2 different functions to avoid a global variable.
        //Wonder what's a better approach?
        let currentWeatherEl = document.getElementById("current-weather");
        currentWeatherEl.append(noResultsMsg);
        noResultsMsg.textContent = "No results found, try another search.";
        return;
      }
      let resultsObj = {};
      resultsObj.cityName = cityName;
      resultsObj.lon = data.city.coord.lon;
      resultsObj.lat = data.city.coord.lat;
      getWeatherResults(resultsObj);
    });
};

let getWeatherResults = (resultsObj) => {
  let lat = resultsObj.lat;
  let lon = resultsObj.lon;
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=585ba3d2e5d78c9afea8cfd73fcf8a69`
  )
    .then((response) => response.json())
    .then((data) => {
      resultsObj.tempVal = data.current.temp;
      resultsObj.humidityVal = data.current.humidity;
      resultsObj.uvi = data.current.uvi;
      resultsObj.windspeedVal = data.current.wind_speed;
      resultsObj.iconVal = data.current.weather[0].icon;
      //icon returns as string. use this url to append to html:
      //http://openweathermap.org/img/wn/{icon code}@2x.png
      getForecastResults(resultsObj, data);
    });
};

let getForecastResults = (resultsObj, data) => {
  resultsObj.forecastResults = [];
  for (let i = 1; i < 6; i++) {
    let forecast = {};
    //new Date using unix value and converting to forecast date
    forecast.date = new Date(data.daily[i].dt * 1000);
    forecast.tempVal = data.daily[i].temp.day;
    forecast.humidityVal = data.daily[i].humidity;
    forecast.uvi = data.daily[i].uvi;
    forecast.windspeedVal = data.daily[i].wind_speed;
    forecast.iconVal = data.daily[i].weather[0].icon;
    resultsObj.forecastResults.push(forecast);
  }
  console.log(resultsObj);
  renderCurrentResults(resultsObj);
};

let renderCurrentResults = (resultsObj) => {
  let cityAndDateEl = document.getElementById("name-date");
  cityAndDateEl.innerHTML = `${
    resultsObj.cityName
  } (${new Date().toLocaleDateString(
    "en-US"
  )}) <img src='http://openweathermap.org/img/wn/${
    resultsObj.iconVal
  }@2x.png' />`;
  cityAndDateEl.append(p);
};
eventHandler();
initSearchButtons();
