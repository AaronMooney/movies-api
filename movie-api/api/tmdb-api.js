import fetch from 'node-fetch';
import cors from 'cors'


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
    return fetch(
      `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${process.env.TMDB_KEY}`
    )
      .then(res => res.json())
  };