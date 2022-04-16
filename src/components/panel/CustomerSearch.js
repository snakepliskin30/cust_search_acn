import React, { Fragment, useCallback, useState } from "react";
import Accordion from "../layout/Accordion";
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";
import Spinner from "../ui/Spinner";

import "./CustomerSearch.css";

const CustomerSearch = (props) => {
  const [showForm, setShowForm] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchAddressHander = async (params) => {
    setIsLoading(true);
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    setSearchResult(data);
    setShowResult(true);
    setIsLoading(false);
  };

  const showResultHandler = useCallback(() => {
    setShowResult((current) => !current);
  }, []);

  const showFormtHandler = useCallback(() => {
    setShowForm((current) => !current);
  }, []);
  return (
    <Fragment>
      {isLoading && <Spinner />}
      <Accordion title="Search" id="search" onClick={showFormtHandler}>
        {showForm && <SearchForm onSubmit={searchAddressHander} />}
      </Accordion>
      <Accordion
        title="Search Result"
        id="searchResult"
        onClick={showResultHandler}
      >
        {showResult && <SearchResult searchResult={searchResult} />}
      </Accordion>
    </Fragment>
  );
};

export default CustomerSearch;
