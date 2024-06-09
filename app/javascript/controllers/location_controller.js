import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="location"
export default class extends Controller {
  static targets = [
    "input",
    "city",
    "description",
    "temperature",
    "sunrise",
    "sunset",
    "wind",
  ];
  connect() {
    // console.log("Hello, Stimulus!");
    // console.log(this.inputTarget);
    // console.log(this.cityTarget);
    // console.log(this.descriptionTarget);
    // console.log(this.temperatureTarget);
    // console.log(this.element.dataset.locationKey);
  }

  search(event) {
    event.preventDefault();

    // capitalize the first letter
    const capitalize = (string) => {
      if (typeof string !== "string") return "";
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const skyTranscription = (description) => {
      switch (description) {
        case "Clear sky":
          return " 🌤️ Ciel dégagé";
        case "Few clouds":
          return "⛅️ Quelques nuages";
        case "Scattered clouds":
          return "☁️ Nuages épars";
        case "Broken clouds":
          return "🌦️ Nuageux";
        case "Rain":
          return "🌧️ Pluie";
        case "Thunderstorm":
          return "🌩️ Orage";
        case "Snow":
          return "❄️ Neige";
        case "Mist":
          return "💨 Brouillard";
        default:
          return city.weather[0].description;
      }
    };

    // Get weather data
    console.log("Searching...");
    const key = this.element.dataset.locationKey;

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${this.inputTarget.value}&appid=${key}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const lat = data[0].lat;
        const lon = data[0].lon;
        const url_city = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
        fetch(url_city)
          .then((response) => response.json())
          .then((city) => {
            console.log(city);
            // name + temperature
            this.cityTarget.innerText = city.name;
            this.temperatureTarget.innerText = `🌡️ ${Math.round(
              city.main.temp - 273.15
            )}°C`;
            // description
            const description = capitalize(city.weather[0].description);
            this.descriptionTarget.innerText = skyTranscription(description);

            // wind
            if (city.wind.speed < 0.1) {
              city.wind.speed = 0;
            }
            this.windTarget.innerText = `💨 ${Math.round(
              city.wind.speed * 3.6
            )} km/h`;

            // time conversion : sunrise and sunset
            const sunriseHours = new Date(city.sys.sunrise * 1000).getHours();
            const sunriseMinutes = new Date(
              city.sys.sunrise * 1000
            ).getMinutes();
            this.sunriseTarget.innerText = `🌅 ${sunriseHours}h${sunriseMinutes}`;

            const sunsetHours = new Date(city.sys.sunset * 1000).getHours();
            const sunsetMinutes = new Date(city.sys.sunset * 1000).getMinutes();
            this.sunsetTarget.innerText = `🌇 ${sunsetHours}h${sunsetMinutes}`;
          });
      });
  }
}

// ! récupérer heure coucher du soleil et lever du soleil
