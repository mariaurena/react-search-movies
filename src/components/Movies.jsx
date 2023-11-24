function ListOfMovies ({ movies }){
    return (
        <ul className='movies'>
        {
            movies.map(movie => (
            <li className='movie' key={movie.id}>
                <h3>{movie.title}</h3>
                <p>{movie.year}</p>
                <img src={movie.poster} alt={movie.title}></img>
            </li>
            ))
        }
        </ul>
    )
}

function NoMoviesResult () {
    return (
        <p>No se encontraron peliculas para esta búsqueda</p>
    )
}

export function Movies ({ movies }) {
    // sabemos que hay resultado cuando tenemos search y es un array (with-results.json)
    const hasMovies = movies?.length > 0

    return (
        hasMovies
         ? <ListOfMovies movies={movies} />
         : <NoMoviesResult></NoMoviesResult>
    )
}