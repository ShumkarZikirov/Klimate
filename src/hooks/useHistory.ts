import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalStorage } from './useLocalStorage'

interface HistoryState {
	id: string
	name: string
	query: string
	lat: number
	lon: number
	country: string
	state?: string
	searchedAt: number
}
export function UseHistory() {
	const [history, setHistory] = useLocalStorage<HistoryState[]>('history', [])
	const queryClient = useQueryClient()
	const historyQuery = useQuery({
		queryKey: ['history'],
		queryFn: () => history,
		initialData: history,
	})
	const addHistory = useMutation({
		mutationFn: async (search: Omit<HistoryState, 'id' | 'searchedAt'>) => {
			const newSearch = {
				...search,
				id: `${search.lat}-${search.lon}-${Date.now()}`,
				searchedAt: Date.now(),
			}
			const filterHistory = history.filter(
				item => item.lat !== search.lat && item.lon !== search.lon
			)
			const newHistory = [newSearch, ...filterHistory].slice(0, 10)
			setHistory(newHistory)
			return newHistory
		},
		onSuccess: data => {
			queryClient.setQueryData(['history'], data)
		},
	})
	const clearHistory = useMutation({
		mutationFn: async () => {
			setHistory([])
			return []
		},
		onSuccess: data => {
			queryClient.setQueryData(['history'], data)
		},
	})

	return {
		history: historyQuery.data ?? [],
		addHistory,
		clearHistory,
	}
}
