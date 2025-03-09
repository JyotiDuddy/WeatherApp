import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("london");
  const [cityData, setCityData] = useState(null);
  const [error, setError] = useState(false);
  const [isDay, setIsDay] = useState(true);

  const key = "1761b9967c8f4aa290d35018250903"; // Your API key

  function weatherHandler() {
    fetch(`http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("CITY NOT FOUND");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setIsDay(data.current.is_day === 1);
        setCityData(data);
        localStorage.setItem("lastCity", city);
      })
      .catch((err) => setError(true));
  }

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      setCity(savedCity);
      weatherHandler(savedCity);
    }
  }, []);

  return (
    <div className="container">
      <div className={`App ${isDay ? "light-mode" : "dark-mode"}`}>
        <h1>Weather App</h1>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={() => weatherHandler}>Search</button>
        <div className="weather-info">
          {error && <p>City Not Found</p>}

          {cityData && (
            <div>
              <h1>City: {cityData.location.name}</h1>
              <h4>
                <span>{cityData.location.localtime}</span>
              </h4>
              <div
                style={{
                  backgroundColor: "rgba(0,0,255,0.3)",
                  display: "inline-block",
                  borderRadius: "50%",
                }}
              >
                <img
                  className="weather-icon"
                  src={cityData.current.condition.icon}
                  alt={cityData.current.condition.text}
                />
              </div>
              <p>Temperature: {cityData.current.temp_c}°C</p>
              <p>Humidity: {cityData.current.humidity}%</p>
              <p>Wind Speed: {cityData.current.wind_kph} kph</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
