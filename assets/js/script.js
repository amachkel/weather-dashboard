// let initSearchButtons = () => {
//     let localStorageCities = localStorage.getItem("SearchedCities");
//   let cities = [];

//   if (localStorageCities != null) {
//     cities = JSON.parse(localStorageCities);
//   }
//   for(let i = 0; i < cities.length; i++){
//       renderSearchBtn(cities[i]);
//   }
// }

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
  let currentWeatherEl = document.getElementById("current-weather");
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=585ba3d2e5d78c9afea8cfd73fcf8a69`
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        console.log("No results found");
        currentWeatherEl.innerHTML =
          "<h3>No results found, try another search.</h3>";
        return;
      }
      console.log(data);
      let lon = data.city.coord.lon;
      let lat = data.city.coord.lat;
      console.log(lon, lat);
      getWeatherResults(lon, lat);
    });
};

let getWeatherResults = (lon, lat) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=585ba3d2e5d78c9afea8cfd73fcf8a69`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let tempVal = data.current.temp;
      let humidityVal = data.current.humidity;
      let uviVal = data.current.uvi;
      let windspeedVal = data.current.wind_speed;
      let iconVal = data.current.weather[0].icon;
      //icon returns as string. use this url to append to html:
      //http://openweathermap.org/img/wn/{icon code}@2x.png
      console.log(tempVal, humidityVal, uviVal, windspeedVal, iconVal);

      getForecastResults(data);
    });
};

let getForecastResults = (data) => {
  for (let i = 1; i < 6; i++) {
    let forecastTemp = data.daily[i].temp.day;
    let forecastHumidity = data.daily[i].humidity;
    let forecastUvi = data.daily[i].uvi;
    let forecastWind = data.daily[i].wind_speed;
    let forecastIcon = data.daily[i].weather[0].icon;
    console.log(
      forecastTemp,
      forecastHumidity,
      forecastUvi,
      forecastWind,
      forecastIcon
    );
  }
};

eventHandler();
// initSearchButtons();
