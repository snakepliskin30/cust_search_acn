import React, { useState } from "react";
import useFetchHook from "./useFetchHook";
import { capitalizePremise } from "./helpers";

const buildRequestPayload = (address, city, state, zip) => {
  const apiUrl = "CUSTOM_CFG_SEARCH_ADDRESS_URL";
  const Request = {};
  const Payload = {};

  Payload.formattedAddress = address;
  Payload.city = city;
  Payload.state = state;
  Payload.zipCode = zip;

  Request.Payload = Payload;

  return { Request, apiUrl };
};

const buildAddress = (addrLine1, addrLine2, city, state, zip) => {
  let fullAddress = "";
  if (addrLine1) {
    if (addrLine2) {
      fullAddress += `${capitalizePremise(addrLine1)} `;
    } else {
      fullAddress += `${capitalizePremise(addrLine1)}, `;
    }
  }
  if (addrLine2) {
    fullAddress += `${capitalizePremise(addrLine2)}, `;
  }
  if (city) {
    fullAddress += `${capitalizePremise(city)}, `;
  }
  if (state) {
    fullAddress += `${state} `;
  }
  if (zip) {
    fullAddress += `${zip}`;
  }
  return fullAddress;
};

const formatData = (response) => {
  const custInfo = response.Payload.CustomerInfo;
  let data = custInfo.map((info) => ({ ...info, ...info.ServiceAddress }));
  data = data.map((info) => ({
    ...info,
    fname: info.fullname.trim().substring(0, info.fullname.trim().lastIndexOf(" ")),
    lname: info.fullname.trim().substring(info.fullname.trim().lastIndexOf(" ") + 1),
    addressNotes: info.addressNotes ? info.addressNotes : " ",
    accountNoFormatted: `${info.accountNo.slice(0, 5)}-${info.accountNo.slice(-5)}`,
    address: buildAddress(info.addressLine1, info.addressLine2, info.city, info.state, info.zipCode),
    groupByField: `${buildAddress(info.addressLine1, info.addressLine2, info.city, info.state, info.zipCode)}, ${info.addressNotes ? info.addressNotes : " "}, Premise Number ${info.premiseNo}`,
  }));

  return data;
};

export const usePremiseSearch = () => {
  const [isPremiseLoading, setIsPremiseLoading] = useState(false);
  const [isPremiseError, setIsPremiseError] = useState(false);
  const [isPremiseErrorMessage, setIsPremiseErrorMessage] = useState("");
  const { apiFetch } = useFetchHook();

  const searchPremise = async (address, city, state, zip, sessionToken, profileId, interfaceUrl) => {
    setIsPremiseLoading(true);
    setIsPremiseError(false);
    setIsPremiseErrorMessage("");
    try {
      const { Request, apiUrl } = buildRequestPayload(address, city, state, zip);
      const data = await apiFetch(Request, apiUrl, sessionToken, profileId, interfaceUrl);
      const formattedData = formatData(data);

      setIsPremiseLoading(false);
      return formattedData;
    } catch (e) {
      if (e.name === "AbortError") {
        setIsSSNError(true);
        setIsSSNErrorMessage("TIMEOUT_ERROR");
        return [];
      } else {
        setIsSSNError(true);
        setIsSSNErrorMessage(e.message);
        return [];
      }
    }
  };

  return { isPremiseLoading, isPremiseError, isPremiseErrorMessage, searchPremise };
};
