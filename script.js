let body = document.querySelector(".body");
let showData = document.querySelector(".show-data");
let input = document.querySelector(".input-city");
let temp = document.querySelector(".temp-show");
let city = document.querySelector(".city-name");
let weather = document.querySelector(".text-show");
let wind = document.querySelector(".wind");
let icon = document.querySelector(".icon-show");
let time = document.querySelector(".time");
let arrow = document.getElementById("arrow");

let flag = true;
let slide = document.createElement("div");
body.appendChild(slide);
let lastWeatherData = null;

const weatherBackgrounds = {
  "Sunny": ["./asset/sunny 1.jpg", "./asset/sunny 2.jpg", "./asset/sunny 3.jpg", "./asset/sunny 4.jpg", "./asset/sunny 5.jpg", "./asset/sunny 6.jpg"],
  "Partly cloudy": ["./asset/cloudy 1.jpg", "./asset/cloudy 2.jpg", "./asset/cloudy 3.jpg", "./asset/cloudy 4.jpg", "./asset/cloudy 5.jpg", "./asset/cloudy 6.jpg", "./asset/cloudy 7.jpg", "./asset/cloudy 8.jpg"],
  "Cloudy": ["./asset/cloudy 1.jpg", "./asset/cloudy 2.jpg", "./asset/cloudy 3.jpg", "./asset/cloudy 4.jpg", "./asset/cloudy 5.jpg", "./asset/cloudy 6.jpg", "./asset/cloudy 7.jpg", "./asset/cloudy 8.jpg"],
  "Overcast": ["./asset/cloudy 1.jpg", "./asset/cloudy 2.jpg", "./asset/cloudy 3.jpg", "./asset/cloudy 4.jpg", "./asset/cloudy 5.jpg", "./asset/cloudy 6.jpg", "./asset/cloudy 7.jpg", "./asset/cloudy 8.jpg"],
  "Light rain": ["./asset/rain 1.jpg", "./asset/rain 2.jpg", "./asset/rain 3.jpg", "./asset/rain 4.jpg", "./asset/rain 5.jpg", "./asset/rain 6.jpg", "./asset/rain 7.jpg", "./asset/rain 8.jpg", "./asset/rain 9.jpg"],
  "Moderate rain": ["./asset/rain 1.jpg", "./asset/rain 2.jpg", "./asset/rain 3.jpg", "./asset/rain 4.jpg", "./asset/rain 5.jpg", "./asset/rain 6.jpg", "./asset/rain 7.jpg", "./asset/rain 8.jpg", "./asset/rain 9.jpg"],
  "Heavy rain": ["./asset/rain 1.jpg", "./asset/rain 2.jpg", "./asset/rain 3.jpg", "./asset/rain 4.jpg", "./asset/rain 5.jpg", "./asset/rain 6.jpg", "./asset/rain 7.jpg", "./asset/rain 8.jpg", "./asset/rain 9.jpg"],
  "Patchy rain possible": ["./asset/rain 1.jpg", "./asset/rain 2.jpg", "./asset/rain 3.jpg", "./asset/rain 4.jpg", "./asset/rain 5.jpg", "./asset/rain 6.jpg", "./asset/rain 7.jpg", "./asset/rain 8.jpg", "./asset/rain 9.jpg"]
};

input.addEventListener("keyup", function () {
  fetch(`https://api.weatherapi.com/v1/current.json?key=f23b4171a3804d818b6134041251506&q=${input.value}`)
    .then((req) => req.json())
    .then((data) => {
      console.log(data);

      icon.setAttribute("src", data.current.condition.icon);
      temp.innerHTML = data.current.temp_c + "<sup>°c</sup>";
      city.innerHTML = data.location.name + " " + data.location.country;
      weather.innerHTML = data.current.condition.text;
      wind.innerHTML = "<p>wind kph : </p> &nbsp" + data.current.wind_kph;
      time.innerHTML = data.location.localtime;

      let condition = data.current.condition.text;
      let backgrounds = weatherBackgrounds[condition];

      if (!backgrounds) {
        const lower = condition.toLowerCase();
        if (lower.includes("rain")) {
          backgrounds = weatherBackgrounds["Light rain"];
        } else if (lower.includes("cloud")) {
          backgrounds = weatherBackgrounds["Cloudy"];
        } else if (lower.includes("overcast")) {
          backgrounds = weatherBackgrounds["Overcast"];
        } else if (lower.includes("sun")) {
          backgrounds = weatherBackgrounds["Sunny"];
        } else {
          backgrounds = ["./asset/cloudy 4.jpg"];
        }
      }

      const randomImg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
      body.style.backgroundImage = `url("${randomImg}")`;

      if (condition.toLowerCase().includes("rain")) {
        showData.classList.add("text-white");
        wind.classList.add("text-white");
        time.classList.add("text-white");
      } else {
        showData.classList.remove("text-white");
        wind.classList.remove("text-white");
        time.classList.remove("text-white");
      }

      lastWeatherData = data;
      localStorage.setItem("weatherData", JSON.stringify(data));


      //if slide in open, update chart
      if(!flag && document.getElementById("myChart")){
        renderChart(data)
      }
      
    });
});

arrow.addEventListener("click", function () {
  if (flag) {
    arrow.classList.remove("bottom-0");
    arrow.classList.remove("bottom-[510px]");
    arrow.classList.remove("bottom-[710px]");

    // Set bottom based on screen width
    if (window.innerWidth < 1024) {
      arrow.classList.add("bottom-[710px]");
    } else {
      arrow.classList.add("bottom-[510px]");
    }

    arrow.style.transform = "rotate(180deg)";
    slide.className = "slide";
    flag = false;

    if (lastWeatherData) {
      renderChart(lastWeatherData);
    }
  } else {
    arrow.classList.remove("bottom-[510px]");
    arrow.classList.remove("bottom-[710px]");
    arrow.classList.add("bottom-0");
    arrow.style.transform = "rotate(0deg)";
    flag = true;
    slide.className = "slide-after";
  }
});


function renderChart(data) {
  slide.innerHTML = `
      <div class="w-full px-4 py-6">
        <div class="flex flex-col lg:flex-row justify-center items-center gap-6 w-full">

          <div class="w-full max-w-[350px] sm:max-w-[400px] flex justify-center md:max-w-[450px]">
            <canvas id="myChart" class="w-full h-[240px]"></canvas>
          </div>

          <div class="w-full max-w-[350px] sm:max-w-[400px] md:max-w-[450px] h-[240px] rounded-lg overflow-hidden">
            <iframe id="gmap-iframe" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

        </div>
      </div>

  `;

  setTimeout(() => {
    const ctx = document.getElementById("myChart");

    const chartData = {
      labels: [
        "Temperature (°C)",
        "Feels Like (°C)",
        "Humidity (%)",
        "UV Index",
        "Wind (kph)",
        "Gust (kph)",
        "Pressure (mb)",
        "Cloud (%)",
        "Visibility (km)"
      ],
      datasets: [
        {
          label: "Weather Metrics",
          data: [
            data.current.temp_c,
            data.current.feelslike_c,
            data.current.humidity,
            data.current.uv,
            data.current.wind_kph,
            data.current.gust_kph,
            data.current.pressure_mb,
            data.current.cloud,
            data.current.vis_km
          ],
          backgroundColor: [
            "#f87171", "#fb923c", "#facc15", "#4ade80", "#38bdf8",
            "#a78bfa", "#f472b6", "#60a5fa", "#fcd34d"
          ],
          borderWidth: 0
        }
      ]
    };

    const config = {
      type: "pie",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "white" },
            position: "top"
          },
          title: {
            display: true,
            text: `Weather Breakdown in ${data.location.name}`,
            color: "white"
          },
          tooltip: {
            bodyColor: "white",
            titleColor: "white"
          }
        }
      }
    };

    new Chart(ctx, config);

    const mapFrame = document.getElementById("gmap-iframe");

    mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent( data.location.name + "," + data.location.country)}&output=embed`

  }, 50);
}


window.addEventListener("load", () => {
  const stored = localStorage.getItem("weatherData");
  if (stored) {
    const data = JSON.parse(stored);
    updateWeatherUI(data);
    lastWeatherData = data;
  }
});

function updateWeatherUI(data) {
  icon.setAttribute("src", data.current.condition.icon);
  temp.innerHTML = data.current.temp_c + "<sup>°c</sup>";
  city.innerHTML = data.location.name + " " + data.location.country;
  weather.innerHTML = data.current.condition.text;
  wind.innerHTML = "<p>wind kph : </p> &nbsp" + data.current.wind_kph;
  time.innerHTML = data.location.localtime;

  let condition = data.current.condition.text;
  let backgrounds = weatherBackgrounds[condition];

  if (!backgrounds) {
    const lower = condition.toLowerCase();
    if (lower.includes("rain")) backgrounds = weatherBackgrounds["Light rain"];
    else if (lower.includes("cloud")) backgrounds = weatherBackgrounds["Cloudy"];
    else if (lower.includes("overcast")) backgrounds = weatherBackgrounds["Overcast"];
    else if (lower.includes("sun")) backgrounds = weatherBackgrounds["Sunny"];
    else backgrounds = ["./asset/cloudy 4.jpg"];
  }

  const randomImg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  body.style.backgroundImage = `url("${randomImg}")`;

  if (condition.toLowerCase().includes("rain")) {
    showData.classList.add("text-white");
    wind.classList.add("text-white");
    time.classList.add("text-white");
  } else {
    showData.classList.remove("text-white");
    wind.classList.remove("text-white");
    time.classList.remove("text-white");
  }

  lastWeatherData = data;
}

