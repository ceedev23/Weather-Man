"use client"

import { useState, useEffect } from "react"
import { Search } from "./components/search"
import { WeatherDisplay } from "./components/weather-display"
import { Forecast } from "./components/forecast"
import { LoadingSpinner } from "./components/loading-spinner"
import { ErrorMessage } from "./components/error-message"

interface WeatherData {
  name: string
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
    icon: string
  }>
  wind: {
    speed: number
  }
}

interface ForecastData {
  list: Array<{
    dt: number
    main: {
      temp: number
    }
    weather: Array<{
      id: number
      main: string
    }>
  }>
}

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get user's location weather on initial load
  useEffect(() => {
    const fetchCurrentLocationWeather = () => {
      setIsLoading(true)
      setError(null)

      // Check if geolocation is available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            fetchWeatherByCoords(latitude, longitude)
          },
          (err) => {
            console.log("Geolocation failed:", err)
            // Only fall back to default city if geolocation fails
            fetchWeatherByCity("Ontario, Canada")
          },
          { 
            timeout: 5000,
            enableHighAccuracy: true // Request high accuracy location
          }
        )
      } else {
        // Browser doesn't support geolocation
        console.log("Geolocation not supported")
        fetchWeatherByCity("Ontario, Canada")
      }
    }

    // Add a fallback timer in case geolocation takes too long
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        console.log("Geolocation timed out")
        fetchWeatherByCity("Ontario, Canada")
      }
    }, 5000) // Increased timeout to 5 seconds

    fetchCurrentLocationWeather()

    // Clear the fallback timer on cleanup
    return () => clearTimeout(fallbackTimer)
  }, [])

  const fetchWeatherByCity = async (city: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Current weather
      const weatherResponse = await fetch(`/api/weather?q=${encodeURIComponent(city)}`)

      if (!weatherResponse.ok) {
        throw new Error("City not found")
      }

      const weatherData = await weatherResponse.json()
      setWeatherData(weatherData)
      setLocation(weatherData.name)

      // Forecast
      const forecastResponse = await fetch(`/api/forecast?q=${encodeURIComponent(city)}`)

      if (!forecastResponse.ok) {
        throw new Error("Forecast data not available")
      }

      const forecastData = await forecastResponse.json()
      setForecastData(forecastData)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setIsLoading(true)
    setError(null)

    try {
      // Current weather
      const weatherResponse = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)

      if (!weatherResponse.ok) {
        throw new Error("Weather data not available")
      }

      const weatherData = await weatherResponse.json()
      setWeatherData(weatherData)
      setLocation(weatherData.name)

      // Forecast
      const forecastResponse = await fetch(`/api/forecast?lat=${lat}&lon=${lon}`)

      if (!forecastResponse.ok) {
        throw new Error("Forecast data not available")
      }

      const forecastData = await forecastResponse.json()
      setForecastData(forecastData)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      fetchWeatherByCity(searchTerm)
    }
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Weather App</h1>

        <Search onSearch={handleSearch} />

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {weatherData && <WeatherDisplay weather={weatherData} location={location} />}
            {forecastData && <Forecast forecast={forecastData} />}
          </>
        )}
      </div>
    </div>
  )
}

