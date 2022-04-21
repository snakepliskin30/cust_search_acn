import React, { useState } from "react";
import useFetchHook from "./useFetchHook";
import { translateStatus, getCurrentTimestamp, capitalizePremise } from "./helpers";

const buildRequestPayload = (firstname, middleName, lastName) => {
  const apiUrl = "CUSTOM_CFG_SOCOMLP_NAME_SEARCH";
  const Request = {};
  const Payload = {};
  const CustomerInfo = {};
  const BaseRequest = {};

  BaseRequest.transactionId = getCurrentTimestamp();
  BaseRequest.userId = "X2RGDEZA"; // loggedUser.split("@")[0].toUpperCase();

  CustomerInfo.fname = firstname ? firstname.toUpperCase() : "";
  CustomerInfo.mname = middleName ? middleName.toUpperCase() : "";
  CustomerInfo.lname = lastName ? lastName.toUpperCase() : "";
  CustomerInfo.BaseRequest = BaseRequest;
  Payload.CustomerInfo = CustomerInfo;

  Request.Payload = Payload;

  return { Request, apiUrl };
};

const formatData = (response) => {
  let data = null;
  let custInfo = response.Payload.CustomerInfo;
  custInfo = custInfo.map((info) => ({ ...info, accountStatus: translateStatus(info.accountStatus) }));
  let svcAddress = response.Payload.ServiceAddress;
  let shellCust = response.Payload.ShellCustomer;
  let resultObj = {};
  resultObj.fullName = "";
  resultObj.fname = "";
  resultObj.lname = "";
  resultObj.accountNo = "";
  resultObj.accountNoFormatted = "";
  resultObj.accountStatus = "";
  resultObj.accountType = "";
  resultObj.customerType = "";
  resultObj.revenueClass = "";
  resultObj.operatingCompany = "";
  resultObj.partyId = "";
  resultObj.addressLine1 = "";
  resultObj.addressLine2 = "";
  resultObj.city = "";
  resultObj.state = "";
  resultObj.zipCode = "";
  resultObj.addressNotes = "";

  data = custInfo.map((info) => ({ ...info, ...svcAddress.find((item) => item.partyId === info.partyId) }));
  if (shellCust) {
    const shellCustFinal = shellCust.map((shell) => ({ customerNo: shell.customerNo, fullname: shell.fullName, ...resultObj, address: `Customer record only` }));
    data = [...data, ...shellCustFinal];
  }

  data = data.map((info) => ({
    ...info,
    fname: info.fullname.trim().substring(0, info.fullname.trim().lastIndexOf(" ")),
    lname: info.fullname.trim().substring(info.fullname.trim().lastIndexOf(" ") + 1),
    fullname: info.fullname.trim().replace(/\s+/g, " "),
    address: capitalizePremise(info.address),
    accountNoFormatted: info.accountNo ? `${info.accountNo.slice(0, 5)}-${info.accountNo.slice(-5)}` : "",
    groupByField: `${info.fullname.trim().replace(/\s+/g, " ")}, Customer Number: ${info.customerNo ? info.customerNo : ""}`,
  }));

  return data;
};

export const useNameSearch = () => {
  const [isNameLoading, setIsNameLoading] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [isNameErrorMessage, setIsNameErrorMessage] = useState("");
  const { apiFetch } = useFetchHook();

  const searchName = async (firstname, middleName, lastName, sessionToken, profileId, interfaceUrl) => {
    setIsNameLoading(true);
    setIsNameError(false);
    setIsNameErrorMessage("");
    try {
      const { Request, apiUrl } = buildRequestPayload(firstname, middleName, lastName);
      const data = await apiFetch(Request, apiUrl, sessionToken, profileId, interfaceUrl);
      const formattedData = formatData(data);

      setIsNameLoading(false);
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

  return { isNameLoading, isNameError, isNameErrorMessage, searchName };
};
