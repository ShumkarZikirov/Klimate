import { ForecastData } from '@/api/types'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ArrowDown, ArrowUp, Droplets, Wind } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './UI/card'
interface WeatherForecastProps {
	data: ForecastData
}
interface DailyForecast {
	temp_min: number
	temp_max: number
	weather: {
		id: number
		description: string
		main: string
		icon: string
	}
	date: number
	wind: number
	humidity: number
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {
	const dayliForecast = data.list.reduce((acc, item) => {
		const date = format(new Date(item.dt * 1000), 'dd/MM/yyyy')
		if (!acc[date]) {
			acc[date] = {
				temp_min: item.main.temp_min,
				temp_max: item.main.temp_max,
				weather: item.weather[0],
				date: item.dt,
				wind: item.wind.speed,
				humidity: item.main.humidity,
			}
		} else {
			acc[date].temp_min = Math.min(acc[date].temp_min, item.main.temp_min)
			acc[date].temp_max = Math.max(acc[date].temp_max, item.main.temp_max)
		}
		return acc
	}, {} as Record<string, DailyForecast>)

	const nextDays = Object.values(dayliForecast).slice(0, 6)

	const formatTemp = (temp: number) => `${Math.round(temp)}°`

	return (
		<Card>
			<CardHeader>
				<CardTitle>Прогноз на 5 дней</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-4'>
					{nextDays.map(item => {
						return (
							<div
								key={item.date}
								className='grid grid-cols-3 items-center gap-4 rounded-lg border p-4'
							>
								<div>
									<p className='font-medium'>
										{format(new Date(item.date * 1000), 'MMM d, EEE  ', {
											locale: ru,
										})}
									</p>
									<p className='text-sm text-muted-foreground capitalize'>
										{item.weather.description}
									</p>
								</div>
								<div className='flex justify-center gap-4'>
									<span className='flex items-center text-blue-500'>
										<ArrowDown className='mr-1 h-4 w-4' />
										{formatTemp(item.temp_min)}
									</span>
									<span className='flex items-center text-red-500'>
										<ArrowUp className='mr-1 h-4 w-4' />
										{formatTemp(item.temp_min)}
									</span>
								</div>
								<div className='flex justify-end gap-4'>
									<span className='flex items-center gap-1'>
										<Droplets className='h-4 w-4 text-blue-500' />
										<span className='text-sm'>{item.humidity}%</span>
									</span>
									<span className='flex items-center gap-1'>
										<Wind className='h-4 w-4 text-blue-500' />
										<span className='text-sm'>{item.wind} м/с</span>
									</span>
								</div>
							</div>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}

export default WeatherForecast
