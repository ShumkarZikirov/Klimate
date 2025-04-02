import { API_CONFIG } from './config'
import {
	Coordinates,
	ForecastData,
	GeocodingResponse,
	WeatherData,
} from './types'

const createUrl = (
	endpoint: string,
	params: Record<string, string | number>
) => {
	const searchParams = new URLSearchParams({
		appid: API_CONFIG.API_KEY,
		...params,
		lang: 'ru',
	})
	return `${endpoint}?${searchParams.toString()}`
}

const fetchData = async <T>(url: string): Promise<T> => {
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error(`Weather API error: ${response.statusText}`)
	}
	return response.json()
}

export const getCurrentWeather = async ({
	lat,
	lon,
}: Coordinates): Promise<WeatherData> => {
	const url = createUrl(`${API_CONFIG.BASE_URL}/weather`, {
		lat: lat.toString(),
		lon: lon.toString(),
		units: API_CONFIG.DEFAULT_PARAMS.units,
	})
	return fetchData<WeatherData>(url)
}

export const getForecast = async ({
	lat,
	lon,
}: Coordinates): Promise<ForecastData> => {
	const url = createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
		lat: lat.toString(),
		lon: lon.toString(),
		units: API_CONFIG.DEFAULT_PARAMS.units,
	})
	return fetchData<ForecastData>(url)
}

export const reverseGeocode = async ({
	lat,
	lon,
}: Coordinates): Promise<GeocodingResponse[]> => {
	const url = createUrl(`${API_CONFIG.GEO}/reverse`, {
		lat: lat.toString(),
		lon: lon.toString(),
		limit: 1,
	})
	return fetchData<GeocodingResponse[]>(url)
}

export const searchLocation = async (
	query: string
): Promise<GeocodingResponse[]> => {
	const url = createUrl(`${API_CONFIG.GEO}/direct`, {
		q: query,
		limit: 5,
	})
	return fetchData<GeocodingResponse[]>(url)
}
