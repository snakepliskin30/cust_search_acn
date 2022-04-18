import React, { Fragment, useCallback, useEffect, useState } from "react";
import Accordion from "../layout/Accordion";
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";
import Spinner from "../ui/Spinner";
import { useSSNSearch } from "../../hooks/useSSNSearch";
import { useServiceCloudEnv } from "../../hooks/useServiceCloudEnv";

import "./CustomerSearch.css";

const CustomerSearch = (props) => {
  const [showForm, setShowForm] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const { isSSNLoading, isSSNError, isSSNErrorMessage, searchSSN } = useSSNSearch();
  const { osvcExtensionProv, osvcGlobalContext, osvcSessionToken, osvcProfileId, osvcInterfaceUrl, getOsVcEnvValues } = useServiceCloudEnv();

  const searchAddressHander = async (params) => {
    if (params.ssntin) {
      const data = await searchSSN(params.ssntin, osvcSessionToken, osvcProfileId, osvcInterfaceUrl);
      setSearchResult(data);
    }
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

  useEffect(() => {
    getOsVcEnvValues();
  }, [getOsVcEnvValues]);

  return (
    <Fragment>
      {isSSNLoading && <Spinner />}
      <Accordion title="Search" id="search" onClick={showFormtHandler}>
        {showForm && <SearchForm onSubmit={searchAddressHander} />}
      </Accordion>
      <Accordion title="Search Result" id="searchResult" onClick={showResultHandler}>
        {showResult && <SearchResult searchResult={searchResult} />}
      </Accordion>
    </Fragment>
  );
};

export default CustomerSearch;
