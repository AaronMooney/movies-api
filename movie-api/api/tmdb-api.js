import fetch from 'node-fetch';


export const getMovies = () => {
    return fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_KEY}&language=en-US&include_adult=false&page=1`)
      .then(res => res.json())
  };

  export const getTvShows = () => {
    return fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
    )
      .then(res => res.json())
  };

  export const getTrendingTvShows = () => {
    return fetch(
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.TMDB_KEY}`
    )
      .then(res => res.json())
  }

  export const getTrendingMovies = () => {
    return fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_KEY}`
    )
      .then(res => res.json())
  }

  export const getUpcomingMovies = () => {
    return fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_KEY}`
    )
      .then(res => res.json())
  }
  
  export const getMovie = id => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_KEY}`
    ).then(res => res.json());
  };

  export const getTvShow = id => {
    return fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_KEY}`
    ).then(res => res.json());
  };
  
  export const getGenres = () => {
    return fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_KEY}&language=en-US`)
      .then(res => res.json())
  };

  export const getMovieReviews = id => {
    console.log("getting review")
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.TMDB_KEY}`
    )
      .then(res => {return res.json()});
  };

  export const getTvShowReviews = id => {
    console.log("getting tv review")
    return fetch(
      `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${process.env.TMDB_KEY}`
    )
      .then(res =>{ return res.json()})
  };

  export const getPopularPeople = () => {
    return fetch(
      `https://api.themoviedb.org/3/person/popular?api_key=${process.env.TMDB_KEY}`
    )
      .then(res => res.json())
  }

  export const getPerson = id => {
    console.log("getting person")
    return fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_KEY}`
    ).then(res => res.json());
  };

  export const getCredits = id => {
    return fetch(
      `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${process.env.TMDB_KEY}`
    ).then(res => res.json());
  };