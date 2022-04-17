import React, { Fragment, useCallback, useEffect, useState } from "react";
import Accordion from "../layout/Accordion";
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";
import Spinner from "../ui/Spinner";
import { useSearchHook } from "../../hooks/useSearchHook";

import "./CustomerSearch.css";

const CustomerSearch = (props) => {
  const [showForm, setShowForm] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const { isLoading, searchResult, search } = useSearchHook();

  const searchAddressHander = async (params) => {
    search(params);
  };

  const showResultHandler = useCallback(() => {
    setShowResult((current) => !current);
  }, []);

  const showFormtHandler = useCallback(() => {
    setShowForm((current) => !current);
  }, []);

  useEffect(() => {
    if (searchResult.length > 0) {
      setShowResult(true);
    }
  }, [searchResult]);

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
