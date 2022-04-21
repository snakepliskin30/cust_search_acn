import React, { Fragment, useCallback, useEffect, useState } from "react";
import Accordion from "../layout/Accordion";
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";
import Spinner from "../ui/Spinner";
import { useServiceCloudEnv } from "../../hooks/useServiceCloudEnv";
import { useSSNSearch } from "../../hooks/useSSNSearch";
import { usePhoneSearch } from "../../hooks/usePhoneSearch";
import { useNameSearch } from "../../hooks/useNameSearch";
import { usePremiseSearch } from "../../hooks/usePremiseSearch";

import "./CustomerSearch.css";

const CustomerSearch = (props) => {
  const [showForm, setShowForm] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [searchResult, setSearchResult] = useState({ data: [] });
  const { isSSNLoading, isSSNError, isSSNErrorMessage, searchSSN } = useSSNSearch();
  const { isPhoneLoading, isPhoneError, isPhoneErrorMessage, searchPhone } = usePhoneSearch();
  const { isNameLoading, isNameError, isNameErrorMessage, searchName } = useNameSearch();
  const { isPremiseLoading, isPremiseError, isPremiseErrorMessage, searchPremise } = usePremiseSearch();
  const { osvcExtensionProv, osvcGlobalContext, osvcSessionToken, osvcProfileId, osvcInterfaceUrl, getOsVcEnvValues } = useServiceCloudEnv();

  const searchAddressHander = async (params) => {
    if (params.ssntin) {
      const data = await searchSSN(params.ssntin, osvcSessionToken, osvcProfileId, osvcInterfaceUrl);
      setSearchResult({ data: data, isCustSearch: true });
    } else if (params.phone) {
      const data = await searchPhone(params.phone, osvcSessionToken, osvcProfileId, osvcInterfaceUrl);
      setSearchResult({ data: data, isCustSearch: true });
    } else if (params.firstName || params.lastName) {
      const data = await searchName(params.firstName, params.middleName, params.lastName, osvcSessionToken, osvcProfileId, osvcInterfaceUrl);
      setSearchResult({ data: data, isCustSearch: true });
    } else if (params.street) {
      const data = await searchPremise(params.street, params.city, params.state, params.zip, osvcSessionToken, osvcProfileId, osvcInterfaceUrl);
      setSearchResult({ data: data, isPremiseSearch: true });
    }
  };

  const showResultHandler = useCallback(() => {
    setShowResult((current) => !current);
  }, []);

  const showFormtHandler = useCallback(() => {
    setShowForm((current) => !current);
  }, []);

  useEffect(() => {
    if (searchResult?.data.length > 0) {
      setShowResult(true);
    }
  }, [searchResult]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      getOsVcEnvValues();
    }
  }, [getOsVcEnvValues]);

  return (
    <Fragment>
      {(isSSNLoading || isPhoneLoading || isNameLoading || isPremiseLoading) && <Spinner />}
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
