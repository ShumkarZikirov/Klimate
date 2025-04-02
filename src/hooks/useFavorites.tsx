import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalStorage } from './useLocalStorage'

interface FavoritesState {
	id: string
	name: string
	lat: number
	lon: number
	country: string
	state?: string
	addedAt: number
}
export function UseFavorites() {
	const [favorites, setFavorites] = useLocalStorage<FavoritesState[]>(
		'favorites',
		[]
	)
	const queryClient = useQueryClient()
	const favoritesQuery = useQuery({
		queryKey: ['favorites'],
		queryFn: () => favorites,
		initialData: favorites,
		staleTime: Infinity,
	})
	const addFavorites = useMutation({
		mutationFn: async (city: Omit<FavoritesState, 'id' | 'addedAt'>) => {
			const newFavorite: FavoritesState = {
				...city,
				id: `${city.lat}-${city.lon}`,
				addedAt: Date.now(),
			}
			const exists = favorites.some(fav => fav.id === newFavorite.id)
			if (exists) return favorites

			const newFavorites = [...favorites, newFavorite].slice(0, 10)
			setFavorites(newFavorites)
			return newFavorites
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['favorites'] })
		},
	})
	const clearFavorites = useMutation({
		mutationFn: async (cityId: string) => {
			const newFavorites = favorites.filter(fav => fav.id !== cityId)
			setFavorites(newFavorites)
			return newFavorites
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['favorites'] })
		},
	})

	return {
		favorites: favoritesQuery.data ?? [],
		addFavorites,
		clearFavorites,
		isFavorite: (lat: number, lon: number) => {
			return favorites.some(fav => fav.lat === lat && fav.lon === lon)
		},
	}
}
