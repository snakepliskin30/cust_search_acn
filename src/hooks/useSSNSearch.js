import React, { useState } from "react";
import apiFetch from "./apiFetch";
import { getCurrentTimestamp, capitalizePremise } from "./helpers";

const buildRequestPayload = (ssntin) => {
  const apiUrl = "CUSTOM_CFG_SEARCH_SSN_URL";
  const Request = {};
  const Header = {};
  const Payload = {};
  const CustomerInfo = {};

  Header.verb = "get";
  Header.noun = "advancedSearch";
  Header.revision = "1.4";
  Header.organization = "SoCo";
  Header.transactionId = getCurrentTimestamp();
  Request.Header = Header;

  CustomerInfo.SSN = ssntin.replace(/-/g, "");
  Payload.CustomerInfo = CustomerInfo;
  Request.Payload = Payload;

  return { Request, apiUrl };
};

const formatData = (response) => {
  try {
    let data = null;
    const allAccountData = [];
    const allShellData = [];
    const resultObj = {};
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

    const ssnWithAcct = response.Result.Response.ResponseCode.find((p) => p.AccountExistsFlag === "Y");

    if (ssnWithAcct) {
      // const custInfoObj = response.Payload.find((obj) => obj.CustomerInfo);
      // const gpcAcctExist = custInfoObj.CustomerInfo.find((gpc) => gpc.operatingCompany === "GPC");
      let gpcAcctExist = false;
      response.Payload.forEach((record) => {
        if (record?.CustomerInfo) {
          record.CustomerInfo.forEach((i) => {
            if (i?.operatingCompany === "GPC") gpcAcctExist = true;
          });
        }
      });
      response.Payload.forEach((ssnResult) => {
        // Account details
        if (ssnResult?.CustomerInfo) {
          const customerNo = ssnResult.GetCustomer.customerNumber;
          ssnResult.CustomerInfo.forEach((accountData) => {
            if (accountData.operatingCompany.toLowerCase() === "gpc") {
              accountData.customerNo = customerNo;
              accountData.customerType = "";
              accountData.operatingCompany = "";
              accountData.partyId = "";
              accountData.addressLine1 = "";
              accountData.addressLine2 = "";
              accountData.city = "";
              accountData.state = "";
              accountData.zipCode = "";
              accountData.addressNotes = "";
              allAccountData.push(accountData);
            }
            // Only accept non-gpc if gpc doesn't exist
            else if (!gpcAcctExist && accountData.operatingCompany.toLowerCase() !== "gpc") {
              accountData.customerNo = customerNo;
              accountData.accountNo = "";
              accountData.accountStatus = "";
              accountData.revenueClass = "";
              accountData.address = "Non-GPC Account";
              accountData.customerType = "";
              accountData.operatingCompany = "";
              accountData.partyId = "";
              accountData.addressLine1 = "";
              accountData.addressLine2 = "";
              accountData.city = "";
              accountData.state = "";
              accountData.zipCode = "";
              accountData.addressNotes = "";
              allAccountData.push(accountData);
            }
          });
        } else {
          const shellData = {};
          const customerNo = ssnResult.GetCustomer.customerNumber;
          shellData.customerNo = customerNo;
          shellData.accountNo = "";
          shellData.accountStatus = "";
          shellData.revenueClass = "";
          shellData.fullname = ssnResult.GetCustomer.fullName;
          shellData.customerType = "";
          shellData.operatingCompany = "";
          shellData.partyId = "";
          shellData.address = "Customer only record";
          shellData.addressLine1 = "";
          shellData.addressLine2 = "";
          shellData.city = "";
          shellData.state = "";
          shellData.zipCode = "";
          shellData.addressNotes = "";
          allShellData.push(shellData);
          // sessionStorage.setItem("ssn_shell_exist", "true");
        }
      });
    } else {
      response.Payload.forEach((ssnResult) => {
        const shellData = {};
        const customerNo = ssnResult.GetCustomer.customerNumber;
        shellData.customerNo = customerNo;
        shellData.accountNo = "";
        shellData.accountStatus = "";
        shellData.revenueClass = "";
        shellData.fullname = ssnResult.GetCustomer.fullName;
        shellData.customerType = "";
        shellData.operatingCompany = "";
        shellData.partyId = "";
        shellData.address = "Customer only record";
        shellData.addressLine1 = "";
        shellData.addressLine2 = "";
        shellData.city = "";
        shellData.state = "";
        shellData.zipCode = "";
        shellData.addressNotes = "";
        allShellData.push(shellData);
        //   sessionStorage.setItem("ssn_shell_exist", "true");
      });
    }

    data = [...allAccountData, ...allShellData];
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
  } catch (err) {
    console.log(err);
  }
};

export const useSSNSearch = () => {
  const [isSSNLoading, setIsSSNLoading] = useState(false);
  const [isSSNError, setIsSSNError] = useState(false);
  const [isSSNErrorMessage, setIsSSNErrorMessage] = useState("");

  const searchSSN = async (ssntin, sessionToken, profileId, interfaceUrl) => {
    setIsSSNLoading(true);
    setIsSSNError(false);
    setIsSSNErrorMessage("");
    try {
      const { Request, apiUrl } = buildRequestPayload(ssntin);
      const data = await apiFetch(Request, apiUrl, sessionToken, profileId, interfaceUrl);
      const formattedData = formatData(data);

      setIsSSNLoading(false);
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

  return { isSSNLoading, isSSNError, isSSNErrorMessage, searchSSN };
};
