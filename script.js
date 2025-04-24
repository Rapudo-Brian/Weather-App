const apiKey = "your api key"
const searchForm = document.getElementById('search-form');
const searchInput= document.getElementById('search-input');
const cityName = document.getElementById('city-name');
const temp = document.getElementById('temp');
const tempRange = document.getElementById('temp-range');
const description = document.getElementById('description');
const updateTime = document.getElementById('updated-time');
const hourlyForecast = document.getElementById('hourly-forecast');
const dailyForecast = document.getElementById('daily-forecast');

function updateBackground(weather) {
    const type = weather.toLowerCase();
    const video = document.getElementById('bg-video');

    let videosrc = '';
    if (type.includes('cloud')) videosrc = 'video/cloudy.mp4.mp4';
    else if (type.includes('rain')) videosrc = 'video/rainy.mp4.mp4';
    else if (type.includes('clear')) videosrc = 'video/clear.mp4.mp4';
    else if (type.includes('snow')) videosrc = 'video/snow.mp4';
    else videosrc = 'video/pond-japanese.jpg';

    if (video) {
        video.src = videosrc
        video.load();//reloads the video.
        video.play().catch(e =>
            console.log('Autoplay blocked',e
            )
        )
    }
}

function updateMainWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    tempRange.textContent = `${Math.round(data.main.temp_min)}~${Math.round(data.main.temp_max)}°C`;
    const windSpeedKmh = (data.wind.speed * 3.6).toFixed(1);
    description.innerHTML = `
        <strong>${data.weather[0].main}</strong>: ${data.weather[0].description}; <br>
        Feels like: ${Math.round(data.main.feels_like)}°C<br>
        Humidity: ${data.main.humidity}% <br>
        Pressure: ${data.main.pressure}hPa <br>
        Wind: ${windSpeedKmh} Kmh at ${data.wind.deg}°<br>
        Wind: ${data.wind.speed} m/s at ${data.wind.deg}°<br>
        Gust: ${data.wind.gust ? `${data.wind.gust} m/s` : `N/A`} <br>
        Cloudiness: ${data.clouds.all}% <br>
        Visibility: ${data.visibility / 1000} km <br>
        Coodinates: ${data.coord.lat}, ${data.coord.lon} <br>
        Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} <br>
        Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
        updateTime.textContent = `Update: ${new Date(data.dt * 1000).toLocaleTimeString([], { hour: `2-digit`, minute: `2-digit`})}`;
        updateBackground(data.weather[0].main);
}

function createForecastBox(item, type = 'hourly'){
    const box = document.createElement('div');
    box.classList.add(type === 'hourly'? 'hourly-box' : 'daily-box');
    const time = document.createElement('p');
    time.textContent = type === 'hourly' ? new Date(item.dt * 1000).getHours() + ':00': new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short'});

    const icon = document.createElement('img');
    icon.src = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    icon.alt = item.weather[0].description;

    const tempInfo = document.createElement('p');
    const t = type === 'hourly' ? item.main?.temp : item.temp?.day || item.main?.temp;
    tempInfo.textContent = `${Math.round(t)}°C`;

    box.append(time, icon, tempInfo);
    return box;
}

async function fetchForecast(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const data = await res.json();
    hourlyForecast.innerHTML = '';
    dailyForecast.innerHTML = '';

    data.list.slice(0, 18).forEach(item => {
        hourlyForecast.appendChild(createForecastBox(item, 'hourly'));
    });

    const dailyMap = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyMap[date]) {
            dailyMap[date] = [];
        }
        dailyMap[date].push(item);
    });

    const days = Object.values(dailyMap).slice(0, 6)
    days.forEach(dayItems => {
        const temps = dayItems.map(i => i.main.temp);
        const avgTemp = temps.reduce((a, b) => a + b)/temps.length;

        const representative = dayItems[Math.floor(dayItems.length/2)];
        representative.temp = {day: avgTemp};
        dailyForecast.appendChild(createForecastBox(representative, 'daily'));
    });
}

async function fetchWeather(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        updateMainWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon);      
    } catch(err){
        alert('City not found')
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`) 
            .then(res => res.json())
            .then(data => {
                updateMainWeather(data);
                fetchForecast(latitude, longitude);
            });
        }, () => fetchWeather('Nairobi'));
    }   else {
            fetchWeather('Nairobi');
    }
}

searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) fetchWeather(city);
});
getUserLocation();
