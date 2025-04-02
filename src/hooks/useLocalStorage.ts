import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
	const [storeValid, setStoreValid] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key)
			return item ? JSON.parse(item) : initialValue
		} catch (error) {
			console.log(error)
			return initialValue
		}
	})
	useEffect(() => {
		try {
			window.localStorage.setItem(key, JSON.stringify(storeValid))
		} catch (error) {
			console.log(error)
		}
	}, [key, storeValid])
	return [storeValid, setStoreValid] as const
}
