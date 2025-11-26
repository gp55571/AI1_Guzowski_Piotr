const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector);
        this.currentWeather = undefined;
    }

    getDayName(dateString) {
        const dni = [
            "Niedziela", "Poniedziałek", "Wtorek",
            "Środa", "Czwartek", "Piątek", "Sobota"
        ];
        return dni[new Date(dateString).getDay()];
    }

    getCurrentWeather(query) {
        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${query}` +
            `&appid=${this.apiKey}&units=metric&lang=pl`;

        const xml = new XMLHttpRequest();
        xml.open("GET", url);

        xml.onload = () => {
            const data = JSON.parse(xml.responseText);
            console.log("Wynik API dla XML: ", data);
        };

        xml.onerror = () => console.error("Blad polaczenia");

        xml.send();
    }

    getWeather(query) {
        const url =
            `https://api.openweathermap.org/data/2.5/forecast?q=${query}` +
            `&appid=${this.apiKey}&units=metric&lang=pl`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log("Wynik API dla Fetch:", data);

                this.currentWeather = data;
                this.drawWeather5Days();
            })
            .catch(err => {
                console.error("Blad", err);
            });
    }

    drawWeather5Days() {
        this.resultsBlock.innerHTML = "";

        if (!this.currentWeather || !this.currentWeather.list) {
            this.resultsBlock.innerHTML = "<p>Brak danych pogodowych.</p>";
            return;
        }

        const data = this.currentWeather.list;

        const days = {};
        data.forEach(item => {
            const day = item.dt_txt.split(" ")[0];
            if (!days[day]) days[day] = [];
            days[day].push(item);
        });

        const dayKeys = Object.keys(days).slice(0, 5);

        dayKeys.forEach(day => {
            const items = days[day];
            let best = items.reduce((prev, curr) => {
                return Math.abs(curr.dt_txt.includes("12:00") ? 0 : 1) <
                       Math.abs(prev.dt_txt.includes("12:00") ? 0 : 1)
                    ? curr : prev;
            });

            const block = this.createWeatherBlock(
                this.getDayName(day),
                best.main.temp,
                best.main.feels_like,
                best.weather[0].icon,
                best.weather[0].description
            );
            this.resultsBlock.appendChild(block);
        });
    }

    createWeatherBlock(dateString, temperature, feelsLike, iconName, description) {
        const block = document.createElement("div");
        block.className = "weather-block";

        block.innerHTML = `
            <div class="weather-date">${dateString}</div>
            <div class="weather-temperature">${temperature.toFixed(1)}°C</div>
            <div class="weather-feels-like">Odczuwalna: ${feelsLike.toFixed(1)}°C</div>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${iconName}@2x.png">
            <div class="weather-description">${description}</div>
        `;

        return block;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    document.WeatherApp = new WeatherApp(
        "4ec0f04f2429cdbe7bdf3c9809c73f70",
        "#weather-results-container"
    );

    document.querySelector("#check").addEventListener("click", function () {
        const query = document.querySelector("#locationInput").value;

        document.WeatherApp.getCurrentWeather(query);
        document.WeatherApp.getWeather(query);
    });
});
