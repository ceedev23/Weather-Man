import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("q")
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  let url: string

  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`
  } else {
    return NextResponse.json({ error: "Missing query parameters" }, { status: 400 })
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenWeather API error:", errorData)
      return NextResponse.json({ error: errorData.message || "City not found" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}

