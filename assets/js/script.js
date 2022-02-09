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

let getSearchInput = (e, shouldRenderBtn = true) => {
  e.preventDefault();
  let cityNameEl = document.getElementById("searchInput");
  let cityName = cityNameEl.value;
  if (cityName == "" || cityName == null) {
    return;
  }
  let localStorageCities = localStorage.getItem("SearchedCities");
  let cities = [];

  if (localStorageCities != null) {
    cities = JSON.parse(localStorageCities);
  }

  if (!cities.includes(cityName) && shouldRenderBtn) {
    cities.push(cityName);
    renderSearchBtn(cityName);
    localStorage.setItem("SearchedCities", JSON.stringify(cities));
  }
  cityNameEl.value = "";
  getCoordinates(cityName);
};

let renderSearchBtn = (cityName) => {
  let searchHistoryEl = document.getElementById("search-history");
  let searchHistoryBtn = document.createElement("button");
  searchHistoryBtn.textContent = cityName;
  searchHistoryBtn.classList.add("btn", "btn-secondary", "btn-lg", "btn-block");
  searchHistoryEl.append(searchHistoryBtn);
  searchHistoryBtn.addEventListener("click", function (e) {
    let cityNameEl = document.getElementById("searchInput");
    cityNameEl.value = e.target.textContent;
    console.log(cityNameEl.value);
    getSearchInput(e, false);
  });
};

let getCoordinates = (cityName) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=585ba3d2e5d78c9afea8cfd73fcf8a69`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.cod != null && data.cod == "404") {
        handleErrorMsg("No results found, try another search.");
        return;
      }
      handleErrorMsg("");
      let resultsObj = {};
      resultsObj.cityName = cityName;
      resultsObj.lon = data.city.coord.lon;
      resultsObj.lat = data.city.coord.lat;
      getWeatherResults(resultsObj);
    });
};

let handleErrorMsg = (message) => {
  let currentWrapperEl = document.getElementById("current-wrapper");
  let errorMsgEl = document.getElementById("errorMsg");
  currentWrapperEl.style.display = "block";
  errorMsgEl.textContent = message;
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
  //   console.log(forecastResults);
  renderCurrentResults(resultsObj);
  renderForecastResults(resultsObj.forecastResults);
};

let renderCurrentResults = (resultsObj) => {
  let currentWrapperEl = document.getElementById("current-wrapper");
  let historyEl = document.getElementById("search-history");
  let cityAndDateEl = document.getElementById("name-date");
  let tempEl = document.getElementById("temp");
  let humidityEl = document.getElementById("humidity");
  let uviEl = document.getElementById("uvi");
  let windspeedEl = document.getElementById("windspeed");
  cityAndDateEl.innerHTML = `${
    resultsObj.cityName
  } (${new Date().toLocaleDateString(
    "en-US"
  )}) <img src='http://openweathermap.org/img/wn/${
    resultsObj.iconVal
  }@2x.png' />`;
  currentWrapperEl.style.display = "block";
  historyEl.style.display = "block";
  tempEl.textContent = `Temp: ${resultsObj.tempVal}`;
  windspeedEl.textContent = `Wind: ${resultsObj.windspeedVal}`;
  humidityEl.textContent = `Humidity: ${resultsObj.humidityVal}`;
  uviEl.textContent = `UV Index: ${resultsObj.uvi}`;
};

let renderForecastResults = (forecast) => {
  let forecastEl = document.getElementById("forecast");
  forecastEl.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    let dailyObj = {};
    dailyObj.date = forecast[i].date;
    dailyObj.tempVal = forecast[i].tempVal;
    dailyObj.humidityVal = forecast[i].humidityVal;
    dailyObj.windspeedVal = forecast[i].windspeedVal;
    dailyObj.iconVal = forecast[i].iconVal;
    console.log(dailyObj);
    let createCard = document.createElement("div");
    createCard.setAttribute("class", "card card-body");
    createCard.style.display = "flex";
    forecastEl.append(createCard);
    let createTitle = document.createElement("h5");
    createTitle.setAttribute("class", "card-title");
    createCard.append(createTitle);
    let createSubtitle = document.createElement("h6");
    createSubtitle.setAttribute("class", "card-subtitle mb-2");
    createCard.append(createSubtitle);
    let createPara1 = document.createElement("p");
    createPara1.setAttribute("id", "dailyTemp");
    createCard.append(createPara1);
    let createPara2 = document.createElement("p");
    createPara2.setAttribute("id", "dailyWind");
    createCard.append(createPara2);
    let createPara3 = document.createElement("p");
    createPara3.setAttribute("id", "dailyHumidity");
    createCard.append(createPara3);
    createTitle.textContent = dailyObj.date;
    createSubtitle.innerHTML = `<img src='http://openweathermap.org/img/wn/${dailyObj.iconVal}@2x.png' />`;
    createPara1.textContent = `Temp: ${dailyObj.tempVal}`;
    createPara2.textContent = `Wind: ${dailyObj.windspeedVal}`;
    createPara3.textContent = `Humidity: ${dailyObj.humidityVal}`;
  }
};
eventHandler();
initSearchButtons();
