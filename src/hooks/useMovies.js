import { useRef, useState, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies'

export function useMovies ( { search, sort }) {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // para guardar la búsqueda anterior 
    // usamos ref porque mantiene el valor entre renderizados
    const previousSearch = useRef(search)

    // usando useMemo hacemos que solo se ejecute la función cuando
    // cambie el search, por ejemplo al hacer click en sort no se ejecuta
    /*const getMovies = useMemo(() => {
        return async ({ search }) => {
            // evitamos dos búsquedas iguales
            if (search === previousSearch.current) return
            try{
                setLoading(true)
                setError(null)
                previousSearch.current = search
                const newMovies = await searchMovies( {search} )
                setMovies(newMovies)
                
            } catch (e){
                setError(e.message)

            } finally {
                // se ejecuta tanto en el try como en el catch
                setLoading(false)
            }
        }
    }, [])*/

    // useCallback es igual que useMemo pero está pensado para cuando
    // queremos devolver una función, simplificando su sintaxis
    const getMovies = useCallback(async ({ search }) => {
        if (search === previousSearch.current) return
        try{
            setLoading(true)
            setError(null)
            previousSearch.current = search
            const newMovies = await searchMovies( {search} )
            setMovies(newMovies)
            
        } catch (e){
            setError(e.message)

        } finally {
            setLoading(false)
        }
    }, [])

    // usamos useMemo para decir: si no cambian las dependencias (el sort o 
    // las movies), el valor de sort se mantendrá igual
    // por ejemplo: si cambia el search no cambia nada, no ejecuta la función
    const sortedMovies = useMemo (() => {
        return sort
            ? [... movies].sort((a,b) => a.title.localeCompare(b.title))
            : movies
    }, [sort, movies])

    return { movies:sortedMovies , getMovies, loading }
}