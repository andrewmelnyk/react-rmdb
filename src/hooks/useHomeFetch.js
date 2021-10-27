import { useState, useEffect } from "react";

import API from "../API";

const initialState = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0,
};

export const useHomeFetch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMovies = async (page, searchTerm = "") => {
    try {
      setError(false);
      setLoading(true);

      const movies = await API.fetchMovies(searchTerm, page);

      setState((prev) => ({
        ...movies,
        results:
          page > 1 ? [...prev.results, ...movies.results] : [...movies.results],
      }));

      setLoading(false);
    } catch (ex) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchMovies(1, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (isLoadingMore) {
      setIsLoadingMore(false);
      fetchMovies(state.page + 1, searchTerm);
    }
  }, [isLoadingMore, searchTerm, state.page]);

  return { state, loading, error, setSearchTerm, searchTerm, setIsLoadingMore };
};
