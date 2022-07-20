var searchInputEl = document.querySelector("#search-input");
var cityInputEl = document.querySelector("#city-name");
var displayCityInfo = document.querySelector("#chosenCity-date");
var displayCurrentTemp = document.querySelector("#current-temp");
var displayCurrentWind = document.querySelector("#current-wind");
var displayCurrentHumidity = document.querySelector("#current-humidity");
var displayCurrentUvIndex = document.querySelector("#current-uv-index");
var displayCurrentIcon = document.querySelector("#currentDay-icon");
var dayEl = document.querySelectorAll(".day");
var tempEl = document.querySelectorAll(".temp");
var windEl = document.querySelectorAll(".wind");
var humidityEl = document.querySelectorAll(".humidity");
var weatherIconsEl = document.querySelectorAll(".weather-icon");
var cityLocationsArr = [];

// to get location info
var getCityData = function (city) {
  var locationApi =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=ed4b8cae65f4f820c783f37bd8790a8e";

  fetch(locationApi)
    .then(function (response) {
      response.json().then(function (data) {
        if (data.length == 0) {
          alert("Sorry, we couldn't find " + city);
        } else {
          var cityName = data[0].name;
          var cityLat = data[0].lat;
          var cityLon = data[0].lon;

          saveLocationInfo(cityName);
          getWeatherInfo(cityName, cityLat, cityLon);
        }
      });
    })

    .catch(function (error) {
      alert("Unable to connect to weather service");
    });
};

// to get weather info based on location
var getWeatherInfo = function (cityName, cityLat, cityLon) {
  var weatherApi =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    cityLat +
    "&lon=" +
    cityLon +
    "&units=metric&exclude=hourly,minutely,&appid=ed4b8cae65f4f820c783f37bd8790a8e";

  fetch(weatherApi).then(function (response) {
    response.json().then(function (data) {
      var currentTemp = data.current.temp;
      var currentWind = data.current.wind;
      var currentHumidity = data.current.humidity;
      var currentUvIndex = data.current.uvIndex;
      var currentIcon = data.current.weather[0].icon;
      var currentDate = moment().format("DD/MM/YYYY");

      displayCityInfo.textContent = cityName + " (" + currentDate + ")";
      displayCurrentTemp.textContent = currentTemp;
      displayCurrentWind.textContent = currentWind;
      displayCurrentHumidity.textContent = currentHumidity;
      displayCurrentUvIndex.textContent = currentUvIndex;
      displayCurrentIcon.src =
        "https://openweathermap.org/img/wn/" + currentIcon + ".png";

      // 5 day forecast info
      for (var i = 1; i < 6; i++) {
        var fiveDayDate = moment().add(i, "days").format("DD/MM/YYYY");

        var fiveDayTemp = data.daily[i].temp.day;
        var fiveDayWind = data.daily[i].wind;
        var fiveDayHumidity = data.daily[i].humidity;
        var fiveDayIcons = data.daily[i].weather[0].icon;

        dayEl[i - 1].textContent = fiveDayDate;
        tempEl[i - 1].textContent = fiveDayTemp;
        windEl[i - 1].textContent = fiveDayWind;
        humidityEl[i - 1].textContent = fiveDayHumidity;
        weatherIconsEl[i - 1].src =
          "https://openweathermap.org/img/wn/" + fiveDayIcons + ".png";
      }
    });
  });
};

// search field response
var searchInputHandler = function (event) {
  event.preventDefault();

  var city = cityInputEl.value.trim();

  if (city) {
    getCityData(city);
    cityInputEl.value = "";
  } else {
    alert("Please enter a valid city");
  }
};

var saveLocationInfo = function (cityName) {
  var locationExist = cityLocationsArr.includes(cityName);

  if (!locationExist) {
    cityLocationsArr.push(cityName);
    localStorage.setItem("cityLocations", JSON.stringify(cityLocationsArr));
  }
};

searchInputEl.addEventListener("submit", searchInputHandler);
