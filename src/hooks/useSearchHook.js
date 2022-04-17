import React, { useState } from "react";

export const useSearchHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const search = async (body) => {
    setIsLoading(true);
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    setSearchResult(data);
    setIsLoading(false);
  };

  return { isLoading, searchResult, search };
};
