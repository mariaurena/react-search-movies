import './App.css'
// permite crear una referencia mutable que persiste en todo el ciclo de vida del componente
import { useEffect, useRef, useState, useCallback } from 'react'
import { useMovies } from './hooks/useMovies'
import { Movies } from './components/Movies'
import debounce from 'just-debounce-it'

function useSearch () {
  const [ search, updateSearch] = useState('')
  const [ error, setError ] = useState(null)

  // para saber si es el primer input del usuario o no
  const isFirstInput = useRef(true)

  // --- validaciones ---
  useEffect( () => {

    // si es el primer input del usuario
    if (isFirstInput.current){
      // si lo que hemos buscado está vacío : true
      // si ya hay alguna letra             : false
      isFirstInput.current = search === ''
      return
    }

    if (search === ''){
      setError('No se puede buscar una película vacía')
      return 
    }

    if (search.match(/^\d+$/)){
      setError("No se puede buscar una película con un número")
      return
    }

    if (search.length < 3) {
      setError("La búsqueda debe tener al menos 3 caracteres")
      return
    }

    setError(null)
  }, [search])

  return { search, updateSearch, error }
}

function App() {
  const [sort, setSort] = useState(false)
  const { search, updateSearch, error} = useSearch()
  const { movies, loading, getMovies } = useMovies( { search,sort })


  const counter = useRef(0) // valor que persiste entre renders
  counter.current++
  // console.log(counter)

  // esperar 300 milisegundos para buscar una pelicula
  const debouncedGetMovies = useCallback(
    debounce( search => {
      console.log('search')
      getMovies({search})
    },300)
    , []
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = () => {
    // hacemos que se actualicen las peliculas cada vez que
    // se escribe una nueva letra
    const newSearch = event.target.value
    updateSearch(newSearch)
    //getMovies({search: newSearch})
    debouncedGetMovies(newSearch)

    // prevalidación: no dejamos que empiece por un ' '
    if (newSearch.startsWith(' ')) return
    updateSearch(event.target.value)
  }

  return (
    <div className='page'>

      <header>
        <h1>Buscador de películas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input 
            style = {{
              border: '1px solid transparent',
              borderColor: error ? 'red':'transparent'
            }} onChange={handleChange} value={search} name='query' placeholder='Avengers, Star Wrs, The Matrix...'></input>
          <input type='checkbox' onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }
      </main>
    </div>
  )
}

export default App
