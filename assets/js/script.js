let eventHandler = () => {
  let searchButtonEl = document.getElementById("searchBtn");
  searchButtonEl.addEventListener("click", renderForecastData);
};

let renderForecastData = (e) => {
  e.preventDefault();
  let cityName = document.getElementById("searchInput").value;
  console.log(cityName);

  getCoordinates(cityName);
};

getCoordinates = (cityName) => {
  let currentWeatherEl = document.getElementById("current-weather");
  fetch(
    `api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=585ba3d2e5d78c9afea8cfd73fcf8a69`
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        console.log("No results found");
        currentWeatherEl.innerHTML =
          "<h3>No results found, try another search.</h3>";
        return;
      }
      let lon = data.coord.lon;
      let lat = data.coord.lat;
      getWeatherResults(lon, lat);
    });
};

getWeatherResults = (lon, lat) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=585ba3d2e5d78c9afea8cfd73fcf8a69`
  )
    .then((response) => response.json())
    .then((data) => {});
};

eventHandler();
