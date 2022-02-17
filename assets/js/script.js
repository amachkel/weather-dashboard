//checks each city that's searched and stored in localStorage, then calls renderSearchBtn with the cities array
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
//search button calls getSearchInput()
let eventHandler = () => {
  let searchButtonEl = $("#searchBtn");
  searchButtonEl.click(getSearchInput);

  let clearBtnEl = $("#clearBtn");
  clearBtnEl.click(function () {
    localStorage.clear();
    searchButtonEl.val("");
  });
};

//shouldRenderBtn is a parameter given a default value of true.
let getSearchInput = (e, shouldRenderBtn = true) => {
  e.preventDefault();
  let cityNameEl = $("#searchInput");
  let cityName = cityNameEl.val();
  if (cityName == "" || cityName == null) {
    return;
  }
  let localStorageCities = localStorage.getItem("SearchedCities");
  let cities = [];

  if (localStorageCities != null) {
    cities = JSON.parse(localStorageCities);
  }
  //if cities array doesn't include city name and param is true,
  if (!cities.includes(cityName) && shouldRenderBtn) {
    //push new cityName to cities array
    cities.push(cityName);
    renderSearchBtn(cityName);
    localStorage.setItem("SearchedCities", JSON.stringify(cities));
  }
  //clears input field after value is gotten
  cityNameEl.val("");
  getCoordinates(cityName);
};
//creates search history buttons with the city name as its text
let renderSearchBtn = (cityName) => {
  let searchHistoryEl = $("#search-history");
  let searchHistoryBtn = $("<button>");
  searchHistoryBtn.text(cityName);
  searchHistoryBtn.addClass("btn btn-secondary btn-lg btn-block");
  searchHistoryEl.append(searchHistoryBtn);
  searchHistoryBtn.click(function (e) {
    let cityNameEl = $("#searchInput");
    cityNameEl.val(e.target.textContent);
    // console.log(cityNameEl.value);
    //calls function and gives shouldRenderBtn a value of false so duplicate buttons aren't made.
    getSearchInput(e, false);
  });
};

//gets coordinates for city name and passes results in object to
let getCoordinates = (cityName) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=585ba3d2e5d78c9afea8cfd73fcf8a69`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      //error that appears in console when search yields no results
      if (data.cod != null && data.cod == "404") {
        //calls error message function with string as param
        handleErrorMsg("No results found, try another search.");
        return;
      }
      //clears error message
      handleErrorMsg("");
      //object contains city name, lon/lat values
      let resultsObj = {};
      resultsObj.cityName = cityName;
      resultsObj.lon = data.city.coord.lon;
      resultsObj.lat = data.city.coord.lat;
      //calls function and passes object as param
      getWeatherResults(resultsObj);
    });
};

let handleErrorMsg = (message) => {
  let currentWrapperEl = $("#current-wrapper");
  let errorMsgEl = $("#errorMsg");
  currentWrapperEl.css("display", "block");
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
      //passes data and results object to function
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
  let currentWrapperEl = $("#current-wrapper");
  let historyEl = $("#search-history");
  let cityAndDateEl = $("#name-date");
  let tempEl = $("#temp");
  let humidityEl = $("#humidity");
  let uviEl = $("#uvi");
  let uviColor = $("#uviColor");
  let windspeedEl = $("#windspeed");
  cityAndDateEl.html(
    `${resultsObj.cityName} (${new Date().toLocaleDateString(
      "en-US"
    )}) <img src='https://openweathermap.org/img/wn/${
      resultsObj.iconVal
    }@2x.png' />`
  );
  //changes elements' displays to make visible
  currentWrapperEl.css("display", "block");
  historyEl.css("display", "block");
  tempEl.text(`Temp: ${resultsObj.tempVal}`);
  windspeedEl.text(`Wind: ${resultsObj.windspeedVal}`);
  humidityEl.text(`Humidity: ${resultsObj.humidityVal}`);
  uviEl.text("UV Index: ");
  uviColor.text(` ${resultsObj.uvi} `);
  colorCodeUvi(resultsObj.uvi, uviColor);
};

let colorCodeUvi = (uvi, uviColor) => {
  if (uvi <= 2) {
    uviColor.css("background", "#008000");
  } else if (uvi <= 5) {
    uviColor.css("background", "#ffff00");
  } else if (uvi <= 7) {
    uviColor.css("background", "#df8000");
  } else if (uvi <= 10) {
    uviColor.css("background", "#df4000");
  } else {
    uviColor.css("background", "#c05fc0");
  }
};

let renderForecastResults = (forecast) => {
  let forecastEl = $("#forecast");
  forecastEl.html("");
  for (let i = 0; i < 5; i++) {
    let dailyObj = {};
    dailyObj.date = forecast[i].date;
    dailyObj.tempVal = forecast[i].tempVal;
    dailyObj.humidityVal = forecast[i].humidityVal;
    dailyObj.windspeedVal = forecast[i].windspeedVal;
    dailyObj.iconVal = forecast[i].iconVal;
    console.log(dailyObj);
    let createCard = $("<div>");
    createCard.addClass("card card-body");
    createCard.css("display", "flex");
    forecastEl.append(createCard);
    let createTitle = $("<h5>");
    createTitle.addClass("card-title");
    createCard.append(createTitle);
    let createSubtitle = $("<h6>");
    createSubtitle.addClass("card-subtitle mb-2");
    createCard.append(createSubtitle);
    let createPara1 = $("<p>");
    createPara1.attr("id", "dailyTemp");
    createCard.append(createPara1);
    let createPara2 = $("<p>");
    createPara2.attr("id", "dailyWind");
    createCard.append(createPara2);
    let createPara3 = $("<p>");
    createPara3.attr("id", "dailyHumidity");
    createCard.append(createPara3);
    createTitle.text(dailyObj.date);
    createSubtitle.html(
      `<img src='http://openweathermap.org/img/wn/${dailyObj.iconVal}@2x.png' />`
    );
    createPara1.text(`Temp: ${dailyObj.tempVal}`);
    createPara2.text(`Wind: ${dailyObj.windspeedVal}`);
    createPara3.text(`Humidity: ${dailyObj.humidityVal}`);
  }
};
eventHandler();
initSearchButtons();
