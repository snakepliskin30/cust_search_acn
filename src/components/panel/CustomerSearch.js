import React, { Fragment, useCallback, useEffect, useState } from "react";
import Accordion from "../layout/Accordion";
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";
import Spinner from "../ui/Spinner";
import Modal from "../layout/Modal";
import { useServiceCloudEnv } from "../../hooks/useServiceCloudEnv";
import { useAccountSearch } from "../../hooks/useAccountSearch";
import { useSSNSearch } from "../../hooks/useSSNSearch";
import { usePhoneSearch } from "../../hooks/usePhoneSearch";
import { useNameSearch } from "../../hooks/useNameSearch";
import { usePremiseSearch } from "../../hooks/usePremiseSearch";

import "./CustomerSearch.css";

const CustomerSearch = () => {
  const [showForm, setShowForm] = useState(true);
  const [searchField, setSearchField] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [searchResult, setSearchResult] = useState({ data: [] });
  const { isSSNLoading, isSSNError, isSSNErrorMessage, searchSSN } = useSSNSearch();
  const { isPhoneLoading, isPhoneError, isPhoneErrorMessage, searchPhone } = usePhoneSearch();
  const { isNameLoading, isNameError, isNameErrorMessage, searchName } = useNameSearch();
  const { isPremiseLoading, isPremiseError, isPremiseErrorMessage, searchPremise } = usePremiseSearch();
  const { osvcExtensionProv, osvcSessionToken, osvcProfileId, osvcInterfaceUrl, osvcInterfaceUrlREST, getOsVcEnvValues } = useServiceCloudEnv();
  const { isAccountLoading, isAccountError, isAccountErrorMessage, searchAccount } = useAccountSearch();
  const [showModal, setShowModal] = useState(false);
  const [modalFields, setModalFields] = useState({});

  const searchAddressHander = async (params) => {
    if (params.accountNumber) {
      const data = await searchAccount(params.accountNumber.replace("-", ""), osvcExtensionProv, osvcSessionToken, osvcProfileId, osvcInterfaceUrl, osvcInterfaceUrlREST);
      setSearchResult({ data: data, isCustSearch: true });
      setSearchField("accountNumber");
    }
    if (params.ssntin) {
      const data = await searchSSN(params.ssntin, osvcSessionToken, osvcProfileId, osvcInterfaceUrl);
      setSearchResult({ data: data, isCustSearch: true });
      setSearchField("ssn");
    } else if (params.phone) {
      const data = await searchPhone(params.phone, osvcSessionToken, osvcProfileId, osvcInterfaceUrl);
      setSearchResult({ data: data, isCustSearch: true });
      setSearchField("phone");
    } else if (params.firstName || params.lastName) {
      const data = await searchName(params.firstName, params.middleName, params.lastName, osvcSessionToken, osvcProfileId, osvcInterfaceUrl);
      setSearchResult({ data: data, isCustSearch: true });
      setSearchField("name");
    } else if (params.street) {
      const data = await searchPremise(params.street, params.city, params.state, params.zip, osvcSessionToken, osvcProfileId, osvcInterfaceUrl);
      setSearchResult({ data: data, isPremiseSearch: true });
      setSearchField("premise");
    }
  };

  const showModalHandler = (customerNo, accountNo) => {
    setShowModal(true);
    setModalFields({ customerNo, accountNo });
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };

  const showResultHandler = useCallback(() => {
    setShowResult((current) => !current);
  }, []);

  const showFormtHandler = useCallback(() => {
    setShowForm((current) => !current);
  }, []);

  const getOsvcParams = useCallback(() => {
    return {
      osvcExtensionProv,
      osvcSessionToken,
      osvcProfileId,
      osvcInterfaceUrl,
      osvcInterfaceUrlREST,
    };
  }, [osvcExtensionProv, osvcSessionToken, osvcProfileId, osvcInterfaceUrl, osvcInterfaceUrlREST]);

  useEffect(() => {
    if (searchResult?.data.length > 0) {
      setShowResult(true);
    }
  }, [searchResult]);

  useEffect(() => {
    getOsVcEnvValues();
  }, [getOsVcEnvValues]);

  return (
    <Fragment>
      <Modal showModal={showModal} hideModalClick={hideModalHandler} searchField={searchField} modalFields={modalFields} getOsvcParams={getOsvcParams} />
      {(isAccountLoading || isSSNLoading || isPhoneLoading || isNameLoading || isPremiseLoading) && <Spinner />}
      {(isAccountError || isNameError || isPhoneError || isPremiseError || isSSNError) && (
        <dir>{isAccountErrorMessage || isNameErrorMessage || isPhoneErrorMessage || isPremiseErrorMessage || isSSNErrorMessage}</dir>
      )}
      <Accordion title="Search" id="search" onClick={showFormtHandler}>
        {showForm && <SearchForm onSubmit={searchAddressHander} />}
      </Accordion>
      <Accordion title="Search Result" id="searchResult" onClick={showResultHandler}>
        {showResult && <SearchResult searchResult={searchResult} getOsvcParams={getOsvcParams} showModalClick={showModalHandler} showModal={showModal} />}
      </Accordion>
    </Fragment>
  );
};

export default React.memo(CustomerSearch);
