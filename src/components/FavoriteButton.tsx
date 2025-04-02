import { WeatherData } from '@/api/types'
import { UseFavorites } from '@/hooks/useFavorites'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './UI/Button'

interface FavoriteButtonProps {
	data: WeatherData
}

const FavoriteButton = ({ data }: FavoriteButtonProps) => {
	const { addFavorites, clearFavorites, isFavorite } = UseFavorites()
	const isCurrentCityFavorite = isFavorite(data.coord.lat, data.coord.lon)

	const handleClick = () => {
		if (isCurrentCityFavorite) {
			clearFavorites.mutate(`${data.coord.lat}-${data.coord.lon}`)
			toast.error(`Город ${data.name} удален из избранного`)
		} else {
			addFavorites.mutate({
				name: data.name,
				lat: data.coord.lat,
				lon: data.coord.lon,
				country: data.sys.country,
			})
			toast.success(`Город ${data.name} добавлен в избранное`)
		}
	}
	return (
		<Button
			onClick={handleClick}
			variant={isCurrentCityFavorite ? 'default' : 'outline'}
			size={'icon'}
			className={
				isCurrentCityFavorite ? 'bg-yellow-500 hover:bg-yellow-600' : ''
			}
		>
			<Star
				className={`h-4 w-4 ${isCurrentCityFavorite ? 'fill-current' : ''}`}
			/>
		</Button>
	)
}

export default FavoriteButton
