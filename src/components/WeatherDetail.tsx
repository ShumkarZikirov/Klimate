import { WeatherData } from '@/api/types'
import { format } from 'date-fns'
import { Compass, Gauge, Sunrise, Sunset } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './UI/card'

interface WeatherDetailProps {
	data: WeatherData
}

const WeatherDetail = ({ data }: WeatherDetailProps) => {
	const { wind, main, sys } = data

	const formatTime = (timeStamp: number) => {
		return format(new Date(timeStamp * 1000), 'HH:mm')
	}
	const getWindDirection = (deg: number) => {
		const directions = [
			'Север (N)',
			'Северо-восток (NE)',
			'Восток (E)',
			'Юго-восток (SE)',
			'Юг (S)',
			'Юго-запад (SW)',
			'Запад (W)',
			'Северо-запад (NW)',
		]
		const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8
		return `${directions[index]} (${deg}°)`
	}
	const details = [
		{
			title: 'Восход солнца',
			value: formatTime(sys.sunrise),
			icon: Sunrise,
			color: 'text-orange-500',
		},
		{
			title: 'Закат солнца',
			value: formatTime(sys.sunrise),
			icon: Sunset,
			color: 'text-blue-500',
		},
		{
			title: 'Направление ветра',
			value: `${getWindDirection(wind.deg)}`,
			icon: Compass,
			color: 'text-green-500',
		},
		{
			title: 'Давление',
			value: `${main.pressure} гПа`,
			icon: Gauge,
			color: 'text-purple-500',
		},
	]
	return (
		<Card>
			<CardHeader>
				<CardTitle>Информация о погоде</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6 sm:grid-cols-2'>
					{details.map(detail => {
						return (
							<div
								key={detail.title}
								className='flex items-center gap-3 rounded-lg border p-4'
							>
								<detail.icon className={`h-5 w-5 ${detail.color}`} />
								<div className='flex flex-col gap-1'>
									<p className='text-sm font-medium leading-none'>
										{detail.title}
									</p>
									<p className='text-sm text-muted-foreground'>
										{detail.value}
									</p>
								</div>
							</div>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}

export default WeatherDetail
