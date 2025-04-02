import { UseWeatherQuery } from '@/hooks/use-weather'
import { UseFavorites } from '@/hooks/useFavorites'
import { Loader2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from './UI/Button'
import { ScrollArea } from './UI/scroll-area'

interface favoritesCitiesProps {
	id: string
	name: string
	lat: number
	lon: number
	onremove: (id: string) => void
}

const FavoritesCities = () => {
	const { clearFavorites, favorites } = UseFavorites()
	if (!favorites.length) {
		return null
	}
	return (
		<>
			<h1 className='text-xl font-bold tracking-tight'>Изранное</h1>
			<ScrollArea className='w-full pb-4'>
				<div className='flex gap-4'>
					{favorites.map(item => {
						return (
							<FavoritesCitiesTablet
								key={item.id}
								{...item}
								onremove={() => clearFavorites.mutate(item.id)}
							/>
						)
					})}
				</div>
			</ScrollArea>
		</>
	)
}

const FavoritesCitiesTablet = ({
	id,
	name,
	lat,
	lon,
	onremove,
}: favoritesCitiesProps) => {
	const navigate = useNavigate()
	const { data: weather, isLoading } = UseWeatherQuery({ lat, lon })
	const handleClick = () => {
		navigate(`/city/${name}?lat=${lat}&lon=${lon}`)
	}
	return (
		<div
			onClick={handleClick}
			className='relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md'
			role='button'
			tabIndex={0}
		>
			<Button
				variant='ghost'
				size='icon'
				className='absolute right-1 top-1 h-6 w-6 rounded-full p-0  hover:text-destructive-foreground group-hover:opacity-100'
				onClick={e => {
					e.stopPropagation()
					onremove(id)
					toast.error(`Город ${name} удален из избранного`)
				}}
			>
				<X className='h-4 w-4' />
			</Button>

			{isLoading ? (
				<div className='flex h-8 items-center justify-center'>
					<Loader2 className='h-4 w-4 animate-spin' />
				</div>
			) : weather ? (
				<>
					<div className='flex items-center gap-2'>
						<img
							src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
							alt={weather.weather[0].description}
							className='h-8 w-8'
						/>
						<div>
							<p className='font-medium'>{name}</p>
							<p className='text-xs text-muted-foreground'>
								{weather.sys.country}
							</p>
						</div>
					</div>
					<div className='ml-auto text-right'>
						<p className='text-xl font-bold'>
							{Math.round(weather.main.temp)}°
						</p>
						<p className='text-xs capitalize text-muted-foreground'>
							{weather.weather[0].description}
						</p>
					</div>
				</>
			) : null}
		</div>
	)
}

export default FavoritesCities
