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
    "navform",
    "icon",
    "iconset",
    "glassmorph",
  ];
  // connect() {
  //   console.log("Connected!");
  //   console.log(this.navformTarget);
  // }

  search(event) {
    event.preventDefault();

    // clear results
    this.clearResults();

    // capitalize the first letter
    const capitalize = (string) => {
      if (typeof string !== "string") return "";
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Get playlist

    const clientID = this.element.dataset.locationClient;
    // console.log(clientID);
    const clientSecret = this.element.dataset.locationSecret;
    // console.log(clientSecret);
    const tokenRequest = {
      grant_type: "client_credentials",
      client_id: `${clientID}`,
      client_secret: `${clientSecret}`,
    };
    const searchParams = new URLSearchParams(tokenRequest);
    // console.log(searchParams.toString());

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
          // console.log(data);
          fetch(
            `https://api.spotify.com/v1/search?query=${typeOfSky}&type=playlist`,
            {
              method: "GET",
              headers: { Authorization: "Bearer " + data.access_token },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              // console.log(data);
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

    const getSvg = (type) => {
      switch (type) {
        case "clear-sky":
          return `<p class="text-[56px] flex items-start font-normal bg-gradient-to-r from-slate-200 via-gray-200 to-slate-50 bg-clip-text text-transparent opacity-90" data-location-target="description">
         <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><radialGradient id="w~INujfpQanMh___D7Au2a" cx="24" cy="24" r="22" gradientUnits="userSpaceOnUse"><stop offset=".724" stop-color="#ffed54"/><stop offset=".779" stop-color="#ffe649"/><stop offset=".877" stop-color="#ffd22d"/><stop offset="1" stop-color="#ffb300"/></radialGradient><path fill="url(#w~INujfpQanMh___D7Au2a)" d="M24,2l1.421,1.474c0.93,0.965,2.388,1.196,3.571,0.566l1.807-0.963l0.896,1.841 c0.586,1.205,1.902,1.876,3.222,1.641l2.016-0.357l0.283,2.028c0.185,1.328,1.229,2.371,2.557,2.557l2.028,0.283l-0.357,2.016 c-0.234,1.32,0.436,2.635,1.641,3.222l1.841,0.896l-0.963,1.807c-0.631,1.183-0.4,2.641,0.566,3.571L46,24l-1.474,1.421 c-0.965,0.93-1.196,2.388-0.566,3.571l0.963,1.807l-1.841,0.896c-1.205,0.586-1.876,1.902-1.641,3.222l0.357,2.016l-2.028,0.283 c-1.328,0.185-2.371,1.229-2.557,2.557l-0.283,2.028l-2.016-0.357c-1.32-0.234-2.635,0.436-3.222,1.641l-0.896,1.841l-1.807-0.963 c-1.183-0.631-2.641-0.4-3.571,0.566L24,46l-1.421-1.474c-0.93-0.965-2.388-1.196-3.571-0.566l-1.807,0.963l-0.896-1.841  c-0.586-1.205-1.902-1.876-3.222-1.641l-2.016,0.357l-0.283-2.028c-0.185-1.328-1.229-2.371-2.557-2.557l-2.028-0.283l0.357-2.016 c0.234-1.32-0.436-2.635-1.641-3.222l-1.841-0.896l0.963-1.807c0.631-1.183,0.4-2.641-0.566-3.571L2,24l1.474-1.421 c0.965-0.93,1.196-2.388,0.566-3.571l-0.963-1.807l1.841-0.896c1.205-0.586,1.876-1.902,1.641-3.222l-0.357-2.016l2.028-0.283 c1.328-0.185,2.371-1.229,2.557-2.557l0.283-2.028l2.016,0.357c1.32,0.234,2.635-0.436,3.222-1.641l0.896-1.841l1.807,0.963 c1.183,0.631,2.641,0.4,3.571-0.566L24,2z"/><linearGradient id="w~INujfpQanMh___D7Au2b" x1="8.092" x2="35.996" y1="8.092" y2="35.996" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fed100"/><stop offset="1" stop-color="#e36001"/></linearGradient><path fill="url(#w~INujfpQanMh___D7Au2b)" d="M24,7C14.611,7,7,14.611,7,24s7.611,17,17,17s17-7.611,17-17S33.389,7,24,7z"/></svg> Ciel dégagé</p>`;
        case "few-clouds":
          return `<%= image_tag("suncloud.png)`; // Replace with actual SVG for "Few clouds"
        case "overcast-clouds":
          return `<%= image_tag("suncloud.png)`; // Replace with actual SVG for "Overcast clouds"
        case "broken-clouds":
          return `<%= image_tag("suncloud.png)`; // Replace with actual SVG for "Broken clouds"
        case "rain":
          return `<%= image_tag("suncloud.png)`; // Replace with actual SVG for "Rain"
        case "thunderstorm":
          return `<%= image_tag("suncloud.png)`; // Replace with actual SVG for "Thunderstorm"
        case "snow":
          return `<%= image_tag("suncloud.png)`; // Replace with actual SVG for "Snow"
        case "mist":
          return `<%= image_tag("suncloud.png)`; // Replace with actual SVG for "Mist"
        default:
          return "";
      }
    };

    const skyTranscription = (description) => {
      switch (description) {
        case "Clear sky":
          document.body.style.background =
            'url("https://images.unsplash.com/photo-1541119638723-c51cbe2262aa?q=80&w=2673&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")';
          spotify("sunny");
          return ` Ciel dégagé`;
        case "Few clouds":
          spotify("clouds");
          return `⛅️ Quelques nuages`;

        case "Overcast clouds":
          document.body.style.background =
            'url("https://images.unsplash.com/photo-1500740516770-92bd004b996e?q=80&w=2972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")';

          spotify("clouds");
          return ` ☁️ Nuages épars`;
        case "Broken clouds":
          document.body.style.background =
            'url("https://images.unsplash.com/photo-1500740516770-92bd004b996e?q=80&w=2972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")';

          spotify("clouds");
          return `☁️ Nuageux`;
        case "Scattered clouds":
          document.body.style.background =
            'url("https://images.unsplash.com/photo-1500740516770-92bd004b996e?q=80&w=2972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")';

          spotify("clouds");
          return `☁️ Nuageux`;
        case "Rain":
          spotify("rain");
          return `🌧️Pluie`;
        case "Thunderstorm":
          spotify("thunderstorm");
          return `🌩️ Orage`;
        case "Snow":
          spotify("snow");
          return "❄️ Neige";
        case "Mist":
          spotify("mist");
          return "💨 Brouillard";
        default:
          return `${description}`;
      }
    };

    // Get weather data
    // console.log("Searching...");
    console.log("ca marche ? ");
    console.log(this.iconsetTarget);
    const key = this.element.dataset.locationKey;

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${this.inputTarget.value}&appid=${key}`;
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
            console.log(city.sys.sunrise);
            // name + temperature
            this.cityTarget.innerText = city.name;
            this.temperatureTarget.innerText = `${Math.round(
              city.main.temp - 273.15
            )}°C`;
            // description
            const description = capitalize(city.weather[0].description);
            if (description === "Clear sky") {
              this.descriptionTarget.outerHTML = getSvg("clear-sky");
            } else {
              this.descriptionTarget.innerText = skyTranscription(description);
            }

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
            this.sunriseTarget.innerText = ` ${sunriseHours}h${sunriseMinutes}`;

            const sunsetHours = new Date(city.sys.sunset * 1000).getHours();
            const sunsetMinutes = new Date(city.sys.sunset * 1000).getMinutes();
            this.sunsetTarget.innerText = `${sunsetHours}h${sunsetMinutes}`;
            this.iconTarget.classList.remove("hidden");
            this.iconsetTarget.classList.remove("hidden");
            this.glassmorphTarget.classList.remove("hidden");
            console.log(location.href);
          });
      });
  }
  clearResults() {
    this.cityTarget.innerText = "";
    this.descriptionTarget.innerText = "";
    this.temperatureTarget.innerText = "";
    this.sunriseTarget.innerText = "";
    this.sunsetTarget.innerText = "";
    this.windTarget.innerText = "";
  }
}
