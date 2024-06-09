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
  // connect() {
  //   console.log("Connected!");
  // }

  search(event) {
    event.preventDefault();

    // capitalize the first letter
    const capitalize = (string) => {
      if (typeof string !== "string") return "";
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Get playlist

    const clientID = this.element.dataset.locationClient;
    console.log(clientID);
    const clientSecret = this.element.dataset.locationSecret;
    console.log(clientSecret);
    const tokenRequest = {
      grant_type: "client_credentials",
      client_id: `${clientID}`,
      client_secret: `${clientSecret}`,
    };
    const searchParams = new URLSearchParams(tokenRequest);
    console.log(searchParams.toString());

    const spotify = (typeOfSky) => {
      const url_token = "https://accounts.spotify.com/api/token";
      fetch(url_token, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: searchParams.toString(),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          fetch(
            `https://api.spotify.com/v1/search?query=${typeOfSky}&type=playlist`,
            {
              method: "GET",
              headers: { Authorization: "Bearer " + data.access_token },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              window.onSpotifyIframeApiReady = (IFrameAPI) => {
                const element = document.getElementById("embed-iframe");
                const options = {
                  uri: `${data.playlists.items["0"].uri}`,
                };
                const callback = (EmbedController) => {};
                IFrameAPI.createController(element, options, callback);
              };
            });
        });
    };

    const skyTranscription = (description) => {
      switch (description) {
        case "Clear sky":
          spotify("sunny");
          return " 🌤️ Ciel dégagé";
        case "Few clouds":
          spotify("clouds");
          return "⛅️ Quelques nuages";
        case "Scattered clouds":
          spotify("clouds");
          return "☁️ Nuages épars";
        case "Broken clouds":
          spotify("clouds");
          return "🌦️ Nuageux";
        case "Rain":
          spotify("rain");
          return "🌧️ Pluie";
        case "Thunderstorm":
          spotify("thunderstorm");
          return "🌩️ Orage";
        case "Snow":
          spotify("snow");
          return "❄️ Neige";
        case "Mist":
          spotify("mist");
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
