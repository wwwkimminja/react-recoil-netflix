const API_KEY = "d04119d5b61c35de10ecb6d04ffdf2dc"
const BASE_PATH = "https://api.themoviedb.org/3"

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(response => response.json())
}

export function getLatestMovies() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(response => response.json())
}

export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(response => response.json())
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(response => response.json())
}

export function searchMovies(keyword: string) {
  return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`).then(response => response.json())
}

export function searchTV(keyword: string) {
  return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`).then(response => response.json())
}
