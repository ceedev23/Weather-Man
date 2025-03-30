"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning, CloudFog } from "lucide-react"

interface WeatherData {
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
  }>
  wind: {
    speed: number
  }
}

interface WeatherDisplayProps {
  weather: WeatherData
  location: string
}

export function WeatherDisplay({ weather, location }: WeatherDisplayProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getWeatherIcon = (weatherId: number) => {
    if (weatherId >= 200 && weatherId < 300) {
      return <CloudLightning className="h-16 w-16 text-yellow-300" />
    } else if (weatherId >= 300 && weatherId < 600) {
      return <CloudRain className="h-16 w-16 text-blue-300" />
    } else if (weatherId >= 600 && weatherId < 700) {
      return <CloudSnow className="h-16 w-16 text-white" />
    } else if (weatherId >= 700 && weatherId < 800) {
      return <CloudFog className="h-16 w-16 text-gray-300" />
    } else if (weatherId === 800) {
      return <Sun className="h-16 w-16 text-yellow-400" />
    } else {
      return <Cloud className="h-16 w-16 text-white" />
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
  }

  const kelvinToCelsius = (kelvin: number) => {
    return Math.round(kelvin - 273.15)
  }

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-lg mb-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">{location}</h2>
          <p className="text-lg opacity-90">{formatDate(time)}</p>
          <p className="text-md opacity-80">{formatTime(time)}</p>
        </div>
        <div className="flex items-center mt-4 sm:mt-0">
          {weather.weather && weather.weather[0] && getWeatherIcon(weather.weather[0].id)}
          <span className="text-4xl sm:text-5xl font-bold ml-2">{kelvinToCelsius(weather.main.temp)}°C</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-white/10 p-3 rounded-xl text-center">
          <p className="text-sm opacity-80">Feels Like</p>
          <p className="text-xl font-semibold">{kelvinToCelsius(weather.main.feels_like)}°C</p>
        </div>
        <div className="bg-white/10 p-3 rounded-xl text-center">
          <p className="text-sm opacity-80">Humidity</p>
          <p className="text-xl font-semibold">{weather.main.humidity}%</p>
        </div>
        <div className="bg-white/10 p-3 rounded-xl text-center">
          <p className="text-sm opacity-80">Wind</p>
          <p className="text-xl font-semibold">{Math.round(weather.wind.speed * 3.6)} km/h</p>
        </div>
        <div className="bg-white/10 p-3 rounded-xl text-center">
          <p className="text-sm opacity-80">Pressure</p>
          <p className="text-xl font-semibold">{weather.main.pressure} hPa</p>
        </div>
      </div>
    </div>
  )
}

