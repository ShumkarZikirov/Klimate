import CurrentWeather from '@/components/CurrentWeather'
import FavoriteButton from '@/components/FavoriteButton'
import HourlyTemperature from '@/components/HourlyTemperature'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/UI/alert'
import WeatherDetail from '@/components/WeatherDetail'
import WeatherForecast from '@/components/WeatherForecast'
import { UseForeCastQuery, UseWeatherQuery } from '@/hooks/use-weather'
import { AlertCircle } from 'lucide-react'
import { useParams, useSearchParams } from 'react-router-dom'

const CityPage = () => {
	const [searchParams] = useSearchParams()
	const params = useParams()
	const lat = parseFloat(searchParams.get('lat') || '0')
	const lon = parseFloat(searchParams.get('lon') || '0')

	const coordinates = { lat, lon }

	const weatherQuery = UseWeatherQuery(coordinates)
	const forecastQuery = UseForeCastQuery(coordinates)

	if (weatherQuery.error || forecastQuery.error) {
		return (
			<Alert variant='destructive'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>Ошибка</AlertTitle>
				<AlertDescription className='flex flex-col gap-4'>
					<p>Не удалось получить данные о погоде.</p>
				</AlertDescription>
			</Alert>
		)
	}
	if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
		return <LoadingSkeleton />
	}
	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h1 className='text-3xl font-bold tracking-tight'>
					{params.cityName}, {weatherQuery.data.sys.country}
				</h1>
				<div>
					<FavoriteButton
						data={{ ...weatherQuery.data, name: params.cityName }}
					/>
				</div>
			</div>
			<div className='grid gap-6'>
				<div className='flex flex-col gap-4 '>
					<CurrentWeather data={weatherQuery.data} />
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

export default CityPage
