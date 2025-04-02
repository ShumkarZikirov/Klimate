import { UseSearchLocationQuery } from '@/hooks/use-weather'
import { UseFavorites } from '@/hooks/useFavorites'
import { UseHistory } from '@/hooks/useHistory'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Clock, Loader2, Search, Star, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './UI/Button'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from './UI/command'

const CitySearch = () => {
	const navigate = useNavigate()
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const { data: locations, isLoading } = UseSearchLocationQuery(query)
	const { addHistory, clearHistory, history } = UseHistory()
	const { favorites } = UseFavorites()
	const handleSelect = (cityData: string) => {
		const [lat, lon, name, country] = cityData.split('|')
		addHistory.mutate({
			query,
			name,
			lat: parseInt(lat),
			lon: parseInt(lon),
			country,
		})
		setOpen(false)
		navigate(`/city/${name}?lat=${lat}&lon=${lon}`)
	}
	return (
		<>
			<Button
				onClick={() => setOpen(true)}
				variant={'outline'}
				className='relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
			>
				<Search className='mr-2 h-4 w-4' />
				Поиск городов...
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput
					placeholder='Поиск городов...'
					value={query}
					onValueChange={setQuery}
				/>
				<CommandList>
					{query.length < 3 && !isLoading && (
						<CommandEmpty>Города не найдены.</CommandEmpty>
					)}
					{favorites.length > 0 && (
						<CommandGroup heading='Избранное'>
							{favorites.map(city => (
								<CommandItem
									key={city.id}
									value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
									onSelect={handleSelect}
								>
									<Star className='mr-2 h-4 w-4 text-yellow-500' />
									<span>{city.name}</span>
									{city.state && (
										<span className='text-sm text-muted-foreground'>
											, {city.state}
										</span>
									)}
									<span className='text-sm text-muted-foreground'>
										, {city.country}
									</span>
								</CommandItem>
							))}
						</CommandGroup>
					)}
					{history && history.length > 0 && (
						<>
							<CommandSeparator />
							<CommandGroup>
								<div className='flex items-center justify-between px-2 my-2'>
									<p className='text-xs text-muted-foreground'>
										Недавние поиски
									</p>
									<Button
										variant={'ghost'}
										size={'sm'}
										onClick={() => clearHistory.mutate()}
									>
										<XCircle className='h-4 w-4' />
										Очистить
									</Button>
								</div>
								{history.map(item => {
									return (
										<CommandItem
											key={item.id}
											value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
											onSelect={handleSelect}
										>
											<Clock className='mr-2 h-4 w-4 text-muted-foreground' />
											<span>{item.name},</span>
											<span> {item.country}</span>
											<span className='ml-auto text-xs text-muted-foreground'>
												{format(item.searchedAt, 'MMM d, hh:mm ', {
													locale: ru,
												})}
											</span>
										</CommandItem>
									)
								})}
							</CommandGroup>
						</>
					)}
					<CommandSeparator />
					{locations && locations.length > 0 && (
						<CommandGroup heading='Предложения'>
							{isLoading && (
								<div className='flex items-center justify-center p-4'>
									<Loader2 className='h-4 w-4 animate-spin' />
								</div>
							)}
							{locations.map(location => {
								return (
									<CommandItem
										key={`${location.lat}-${location.lon}`}
										value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
										onSelect={handleSelect}
									>
										<Search className='mr-2 h-4 w-4' />
										<span>{location.name},</span>
										<span> {location.country}</span>
									</CommandItem>
								)
							})}
						</CommandGroup>
					)}
				</CommandList>
			</CommandDialog>
		</>
	)
}

export default CitySearch
