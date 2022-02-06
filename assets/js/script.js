let eventHandler = () => {
  let searchButtonEl = document.getElementById("searchBtn");
  searchButtonEl.addEventListener("click", getSearchInput);
};

let getSearchInput = (e) => {
  e.preventDefault();
  let cityName = document.getElementById("searchInput").value;
  console.log(cityName);

  getCoordinates(cityName);
};

getCoordinates = (cityName) => {
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

getWeatherResults = (lon, lat) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=585ba3d2e5d78c9afea8cfd73fcf8a69`
  )
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
      let tempVal = data.current.temp;
      let humidityVal = data.current.humidity;
      let uniVal = data.current.uvi;
      let windspeedVal = data.current.wind_speed;
      let iconVal = data.current.weather[0].icon;
      console.log(tempVal, humidityVal, uniVal, windspeedVal, iconVal);
    });
};

eventHandler();
