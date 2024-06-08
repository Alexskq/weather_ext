import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="location"
export default class extends Controller {
  static targets = ["input", "city", "description", "temperature"];
  connect() {
    // console.log("Hello, Stimulus!");
    // console.log(this.inputTarget);
    // console.log(this.cityTarget);
    // console.log(this.descriptionTarget);
    // console.log(this.temperatureTarget);
    // console.log(this.element.dataset.locationKey);
  }

  search() {
    event.preventDefault();
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
            this.cityTarget.innerText = city.name;
            this.descriptionTarget.innerText = city.weather[0].main;
            this.temperatureTarget.innerText = `🌡️ ${Math.round(
              city.main.temp - 273.15
            )}°C`;
          });
      });
  }
}
