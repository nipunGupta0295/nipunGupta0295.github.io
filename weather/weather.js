const iconElement = document.querySelector(".weather-icon");
const locationIcon = document.querySelector(".location-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const buttonScale = document.querySelector(".btnChange");
var input = document.getElementById("search");
let city = "";
let latitude = 0.0;
let longitude = 0.0;
const weather = {};
weather.temperature = {
  unit: "celsius"
};
// start the code
let celsius = false;
//const changeS = document.querySelector(".temperature-value p span");
function changeScale(){
    let v = weather.temperature.value;
    console.log(v);
    if (celsius) {
      const cel = Math.floor((v-32)*5/9);
      tempElement.innerHTML = `${cel}°<span>C</span> `
      celsius = !celsius;
      weather.temperature.value = cel;
      buttonScale.innerHTML = "F";
    }else {
      const far = Math.floor(9/5*v + 32);
      tempElement.innerHTML = `${far}°<span>F</span> `
      celsius = !celsius;
      weather.temperature.value = far;
      buttonScale.innerHTML = "C";
    }

}
input.addEventListener("keyup", function (event) {

  if (event.keyCode === 13) {

    event.preventDefault();

    city = input.value;
    getSearchWeather(city);
    //getSearchPollutionDetails(city);
  }
});

const KELVIN = 273;

const key = "b45739be9f19e20a66af2e7604d7def5"

// we get current location
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}


function setPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  getWeather(latitude, longitude);
  getpollutionDetails(latitude, longitude);
}

locationIcon.addEventListener("click", function (event) {
  getWeather(latitude, longitude);
  getpollutionDetails(latitude, longitude);
});

 function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

 function getSearchWeather(city) {
  let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      console.log("Hello")
      console.log("search weather" + data.coord.longitude+" "+ data.coord.latitude);
      return data;
    })
    .then(function (data) {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(function () {
      displayWeather();
    });
}

 function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(function () {
      displayWeather();
    });
}

 function displayWeather() {
  iconElement.innerHTML = `<img src="images/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}
// check this code.
let pollution  = {};
function getpollutionDetails(latitude, longitude){
  let api = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${key}`;
  fetch(api)
  .then(function (response){
    let data = response.json();
    return data;
  })
  .then(function(data){
    pollution.co = data.list[0].components.co;
    pollution.pm2_5 = data.list[0].components.pm2_5;
    pollution.pm10 = data.list[0].components.pm10;
    //console.log(pollution.co+" "+ pollution.pm2_5+" "+pollution.pm10); 
  })
  .then(function(){
    displayPollution();
  });
}
let coordinates = {};
// function getSearchPollutionDetails(city){
//   let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
//   // let lat = 0;
//   // let long = 0;
//   fetch(api)
//   .then(function(response){
//     let data = response.json;
//     return data;
//   })
//   .then(function(data){
//     coordinates.lat = data.coord.lat;
//     coordinates.long = data.coord.lon;
//   });
//   console.log(coordinates.lat +" "+coordinates.long);

//   // let api2 = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.lat}&lon=${coordinates.long}&appid=${key}`;
//   // fetch(api2)
//   // .then(function (response){
//   //   let data = response.json();
//   //   return data;
//   // })
//   // .then(function(data){
//   //   pollution.co = data.list[0].components.co;
//   //   pollution.pm2_5 = data.list[0].components.pm2_5;
//   //   pollution.pm10 = data.list[0].components.pm10;
//   //   //console.log(pollution.co+" "+ pollution.pm2_5+" "+pollution.pm10); 
//   // })
//   // .then(function(){
//   //   displayPollution();
//   // });
// }
const carbonP = document.querySelector(".co");
const pm2 = document.querySelector(".pm2_5");
const pm1 = document.querySelector(".pm10");
function displayPollution(){
  carbonP.innerHTML = `<span>CO </span><p style = "display:inline-block">${pollution.co}</p>`;
  pm2.innerHTML = `<span>PM2.5 </span><p style = "display:inline-block">${pollution.pm2_5}</p>`;
  pm1.innerHTML = `<span> PM10 </span><p style = "display:inline-block">${pollution.pm10}</p>`;

}

