import { Coordinates } from '@/api/types'
import { useEffect, useState } from 'react'

interface GeolocationState {
	coordinates: Coordinates | null
	error: string | null
	isLoading: boolean
}
export function UseGeolocation() {
	const [locationData, setLocationData] = useState<GeolocationState>({
		coordinates: null,
		error: null,
		isLoading: true,
	})

	const getLocation = () => {
		setLocationData(prev => ({ ...prev, isLoading: true, error: null }))
		if (!navigator.geolocation) {
			setLocationData({
				coordinates: null,
				error: 'Ошибка геолокации',
				isLoading: false,
			})
			return
		}
		navigator.geolocation.getCurrentPosition(
			position => {
				setLocationData({
					coordinates: {
						lat: position.coords.latitude,
						lon: position.coords.longitude,
					},
					error: null,
					isLoading: false,
				})
			},
			error => {
				let errorMessage: string

				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage =
							'Доступ к местоположению запрещен. Пожалуйста, разрешите доступ.'
						break
					case error.POSITION_UNAVAILABLE:
						errorMessage = 'Информация о местоположении недоступна.'
						break
					case error.TIMEOUT:
						errorMessage = 'Время ожидания запроса местоположения истекло.'
						break
					default:
						errorMessage = 'Произошла неизвестная ошибка.'
				}

				setLocationData({
					coordinates: null,
					error: errorMessage,
					isLoading: false,
				})
			},
			{
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0,
			}
		)
	}
	useEffect(() => {
		getLocation()
	}, [])
	return {
		...locationData,
		getLocation,
	}
}
