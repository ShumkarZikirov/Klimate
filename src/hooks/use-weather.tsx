import { Coordinates } from '@/api/types'
import {
	getCurrentWeather,
	getForecast,
	reverseGeocode,
	searchLocation,
} from '@/api/weather'
import { useQuery } from '@tanstack/react-query'

export const WEATHER_KEYS = {
	weather: (coodrs: Coordinates) => ['weather', coodrs] as const,
	forecast: (coodrs: Coordinates) => ['forecast', coodrs] as const,
	location: (coodrs: Coordinates) => ['location', coodrs] as const,
	search: (query: string) => ['location-search', query] as const,
} as const
export const UseWeatherQuery = (coordinates: Coordinates | null) => {
	return useQuery({
		queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
		queryFn: () => (coordinates ? getCurrentWeather(coordinates) : null),
		enabled: !!coordinates,
	})
}
export const UseForeCastQuery = (coordinates: Coordinates | null) => {
	return useQuery({
		queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
		queryFn: () => (coordinates ? getForecast(coordinates) : null),
		enabled: !!coordinates,
	})
}

export const UseReverseGeoCodeQuery = (coordinates: Coordinates | null) => {
	return useQuery({
		queryKey: WEATHER_KEYS.location(coordinates ?? { lat: 0, lon: 0 }),
		queryFn: () => (coordinates ? reverseGeocode(coordinates) : null),
		enabled: !!coordinates,
	})
}
export const UseSearchLocationQuery = (query: string) => {
	return useQuery({
		queryKey: WEATHER_KEYS.search(query),
		queryFn: () => searchLocation(query),
		enabled: query.length > 3,
	})
}
