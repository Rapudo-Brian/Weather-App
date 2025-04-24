Weather App

This is a simple weather application that allows users to search for weather information based on the city name or their current location. The app fetches data from the OpenWeather API and displays current conditions, hourly forecasts, and daily forecasts.



📂Project Structure.

Weather-App/
├── public/
│   ├── index.html         # Main HTML file
│   ├── script.js          # JavaScript for weather data and DOM manipulation
│   └── styles.css         # CSS for styling the app
├── .env                   # API key stored here
├── .gitignore             # Ensure the .env file is ignored by git
├── README.md              # Project documentation
└── video/                 # Folder for background videos
    ├── cloudy.mp4.mp4
    ├── rainy.mp4.mp4
    ├── clear.mp4.mp4
    ├── snow.mp4
    └── pond-japanese.jpg


🛠️ Installation

Prerequisites:

1. Node.js (for development environment)
2. OpenWeather API key (to fetch weather data)

Steps:

1. Clone the repository:
    - git clone https://github.com/yourusername/weather-app.git
    - cd weather-app

2. Create .env file: Inside the root of your project, create a .env file and add your API key:
    - API_KEY=your_openweather_api_key

3. Install dependencies: If you are using any backend or API server (for local testing with Node.js):
    - npm init -y
    - npm install express dotenv node-fetch

4. Update .gitignore file: Make sure your .gitignore includes the .env file to prevent exposing your API key:
    - .env

5. Run the app locally: Open the index.html file in your browser to start testing the weather app.


⚙️ Features

1. City Search: Enter a city name and get current weather details, hourly forecasts, and daily forecasts.

2. Location-based Weather: The app detects the user's current location and displays weather information.

3. Dynamic Backgrounds: Background video changes based on the weather (clear, cloudy, rain, snow).

📡 API Integration

- The app fetches weather data from the OpenWeatherMap API. It uses the following API endpoints:

1. Current Weather: 
            GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric

2. Weather Forecast:
            GET https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric

- Make sure to replace {API_KEY} with your actual OpenWeather API key in the .env file.


How to Test Locally

- Open the index.html file in your browser.
- Enter a city name in the input field or allow the app to use your location.
- The app will display:
        - Current weather details (temperature, humidity, pressure, wind speed, etc.)
        - Hourly weather forecast for the next 18 hours.
        -Daily forecast for the next 6 days.
- The background video will change based on the current weather conditions.



