import CurrentWeather from '@/components/CurrentWeather'
import FavoritesCities from '@/components/FavoritesCities'
import HourlyTemperature from '@/components/HourlyTemperature'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { Button } from '@/components/UI/Button'
import WeatherDetail from '@/components/WeatherDetail'
import WeatherForecast from '@/components/WeatherForecast'
import { UseGeolocation } from '@/hooks/use-geolocation'
import {
	UseForeCastQuery,
	UseReverseGeoCodeQuery,
	UseWeatherQuery,
} from '@/hooks/use-weather'
import { AlertCircle, MapPin, RefreshCcw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../components/UI/alert'
const WeatherPage = () => {
	const {
		coordinates,
		error: locationError,
		getLocation,
		isLoading: locationLoading,
	} = UseGeolocation()

	const locationQuery = UseReverseGeoCodeQuery(coordinates)
	const weatherQuery = UseWeatherQuery(coordinates)
	const forecastQuery = UseForeCastQuery(coordinates)

	const handleRefresh = () => {
		getLocation()
		if (coordinates) {
			locationQuery.refetch()
			weatherQuery.refetch()
			forecastQuery.refetch()
		}
	}
	if (locationLoading) {
		return <LoadingSkeleton />
	}
	if (locationError) {
		return (
			<Alert variant='destructive'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>Ошибка местоположения.</AlertTitle>
				<AlertDescription className='flex flex-col gap-4'>
					<p>{locationError}</p>
					<Button onClick={getLocation} variant={'outline'} className='w-fit'>
						<MapPin className='mr-2 h-4 w-4' />
						Включите доступ к местоположению.
					</Button>
				</AlertDescription>
			</Alert>
		)
	}
	if (!coordinates) {
		return (
			<Alert variant='destructive'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>Требуется местоположение.</AlertTitle>
				<AlertDescription className='flex flex-col gap-4'>
					<p>Включите доступ к местоположению.</p>
					<Button onClick={getLocation} variant={'outline'} className='w-fit'>
						<MapPin className='mr-2 h-4 w-4' />
						Включите доступ к местоположению.
					</Button>
				</AlertDescription>
			</Alert>
		)
	}
	const locationName = locationQuery.data?.[0]

	if (weatherQuery.error || forecastQuery.error) {
		return (
			<Alert variant='destructive'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>Ошибка</AlertTitle>
				<AlertDescription className='flex flex-col gap-4'>
					<p>Failed to fetch weather data.</p>
					<Button onClick={handleRefresh} variant={'outline'} className='w-fit'>
						<MapPin className='mr-2 h-4 w-4' />
						Повторить
					</Button>
				</AlertDescription>
			</Alert>
		)
	}
	if (!weatherQuery.data || !forecastQuery.data) {
		return <LoadingSkeleton />
	}
	return (
		<div className='space-y-4'>
			<FavoritesCities />
			<div className='flex items-center justify-between'>
				<h1 className='text-xl font-bold tracking-tight'>Моё местоположение</h1>
				<Button
					onClick={handleRefresh}
					variant={'outline'}
					size={'icon'}
					disabled={weatherQuery.isFetching || forecastQuery.isFetching}
				>
					<RefreshCcw
						className={` h-4 w-4 ${
							weatherQuery.isFetching ? 'animate-spin' : ''
						}`}
					/>
				</Button>
			</div>
			<div className='grid gap-6'>
				<div className='flex flex-col gap-4 lg:flex-row'>
					<CurrentWeather
						data={weatherQuery.data}
						locationName={locationName}
					/>
					<HourlyTemperature data={forecastQuery.data} />
				</div>
				<div className='grid gap-6 md:grid-cols-2 items-start'>
					<WeatherDetail data={weatherQuery.data} />
					<WeatherForecast data={forecastQuery.data} />
				</div>
			</div>
		</div>
	)
}

export default WeatherPage
