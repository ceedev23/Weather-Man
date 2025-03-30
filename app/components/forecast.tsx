"use client"

import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning, CloudFog } from "lucide-react"

interface ForecastItem {
  dt: number
  main: {
    temp: number
  }
  weather: Array<{
    id: number
    main: string
  }>
}

interface ForecastData {
  list: ForecastItem[]
}

interface ForecastProps {
  forecast: ForecastData
}

export function Forecast({ forecast }: ForecastProps) {
  const getWeatherIcon = (weatherId: number) => {
    if (weatherId >= 200 && weatherId < 300) {
      return <CloudLightning className="h-8 w-8 text-yellow-300" />
    } else if (weatherId >= 300 && weatherId < 600) {
      return <CloudRain className="h-8 w-8 text-blue-300" />
    } else if (weatherId >= 600 && weatherId < 700) {
      return <CloudSnow className="h-8 w-8 text-white" />
    } else if (weatherId >= 700 && weatherId < 800) {
      return <CloudFog className="h-8 w-8 text-gray-300" />
    } else if (weatherId === 800) {
      return <Sun className="h-8 w-8 text-yellow-400" />
    } else {
      return <Cloud className="h-8 w-8 text-white" />
    }
  }

  const kelvinToCelsius = (kelvin: number) => {
    return Math.round(kelvin - 273.15)
  }

  const formatDay = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString([], { weekday: "short" })
  }

  // Get daily forecast (one entry per day)
  const getDailyForecast = () => {
    const dailyData: ForecastItem[] = []
    const days: Record<string, boolean> = {}

    if (forecast.list) {
      forecast.list.forEach((item) => {
        const day = new Date(item.dt * 1000).toDateString()

        if (!days[day]) {
          days[day] = true
          dailyData.push(item)
        }
      })
    }

    return dailyData.slice(0, 5) // Return next 5 days
  }

  const dailyForecast = getDailyForecast()

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-lg">
      <h3 className="text-xl font-medium text-white mb-4">5-Day Forecast</h3>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {dailyForecast.map((day, index) => (
          <div key={index} className="bg-white/10 p-3 rounded-xl text-center text-white">
            <p className="font-normal">{formatDay(day.dt)}</p>
            <div className="flex justify-center my-2">{getWeatherIcon(day.weather[0].id)}</div>
            <p className="text-lg font-normal">{kelvinToCelsius(day.main.temp)}°C</p>
            <p className="text-xs opacity-80">{day.weather[0].main}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

