import React, { Fragment, useEffect, useState } from "react";
import Input from "../ui/Input";
import InputNumber from "../ui/InputNumber";
import ButtonSubmit from "../ui/ButtonSubmit";
import ButtonCancel from "../ui/ButtonCancel";

import classes from "./SearchForm.module.css";

const SearchForm = (props) => {
  const [ssntin, setSSNTin] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("GA");
  const [zip, setZip] = useState("");
  const [ssntinRO, setSSNTinRO] = useState(false);
  const [accountNumberRO, setAccountNumberRO] = useState(false);
  const [phoneRO, setPhoneRO] = useState(false);
  const [firstNameRO, setFirstNameRO] = useState(false);
  const [middleNameRO, setMiddleNameRO] = useState(false);
  const [lastNameRO, setLastNameRO] = useState(false);
  const [streetRO, setStreetRO] = useState(false);
  const [cityRO, setCityRO] = useState(false);
  const [stateRO, setStateRO] = useState(true);
  const [zipRO, setZipRO] = useState(false);
  const [ssnInvalid, setSSNInvalid] = useState(false);
  const [accountNumberInvalid, setAccountNumberInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [firstNameInvalid, setFirstNameInvalid] = useState(false);
  const [lastNameInvalid, setLastNameInvalid] = useState(false);
  const [streetInvalid, setStreetInvalid] = useState(false);

  const setEnableDisable = (...args) => {
    if (args.includes("ssntin")) {
      setSSNTinRO(false);
    } else setSSNTinRO(true);

    if (args.includes("accountNumber")) setAccountNumberRO(false);
    else setAccountNumberRO(true);

    if (args.includes("phone")) setPhoneRO(false);
    else setPhoneRO(true);

    if (args.includes("firstName")) setFirstNameRO(false);
    else setFirstNameRO(true);

    if (args.includes("middleName")) setMiddleNameRO(false);
    else setMiddleNameRO(true);

    if (args.includes("lastName")) setLastNameRO(false);
    else setLastNameRO(true);

    if (args.includes("street")) setStreetRO(false);
    else setStreetRO(true);

    if (args.includes("city")) setCityRO(false);
    else setCityRO(true);

    // if (args.includes("state")) setStateRO(false);
    // else setStateRO(true);

    if (args.includes("zip")) setZipRO(false);
    else setZipRO(true);
  };

  useEffect(() => {
    if (ssntin) setEnableDisable("ssntin");
    if (accountNumber) setEnableDisable("accountNumber");
    if (phone) setEnableDisable("phone");
    if (firstName) setEnableDisable("firstName", "middleName", "lastName");
    if (middleName) setEnableDisable("firstName", "middleName", "lastName");
    if (lastName) setEnableDisable("firstName", "middleName", "lastName");
    if (street) setEnableDisable("street", "city", "zip");
    if (city) setEnableDisable("street", "city", "zip");
    // if (state) setEnableDisable("street", "city", "state", "zip");
    if (zip) setEnableDisable("street", "city", "zip");
    if (!ssntin && !accountNumber && !phone && !firstName && !middleName && !lastName && !street && !city && !zip) {
      setEnableDisable("ssntin", "accountNumber", "phone", "firstName", "middleName", "lastName", "street", "city", "zip");
      setSSNInvalid(false);
      setAccountNumberInvalid(false);
      setPhoneInvalid(false);
      setFirstNameInvalid(false);
      setLastNameInvalid(false);
      setStreetInvalid(false);
    }
  }, [ssntin, accountNumber, phone, firstName, middleName, lastName, street, city, state, zip]);

  const submitFormHandler = (e) => {
    e.preventDefault();
    if (validateFields())
      props.onSubmit({
        ssntin,
        accountNumber,
        phone,
        firstName,
        middleName,
        lastName,
        street,
        city,
        state,
        zip,
      });
  };

  const validateFields = () => {
    let fieldsInvalid = 0;
    if (ssntin) {
      if (ssntin.replace(/-/g, "").length !== 9) {
        setSSNInvalid(true);
        ++fieldsInvalid;
      } else {
        setSSNInvalid(false);
      }
    } else if (accountNumber) {
      if (accountNumber.replace(/-/g, "").length !== 10) {
        setAccountNumberInvalid(true);
        ++fieldsInvalid;
      } else {
        setAccountNumberInvalid(false);
      }
    } else if (phone) {
      if (phone.replace(/-/g, "").length !== 10) {
        setPhoneInvalid(true);
        ++fieldsInvalid;
      } else {
        setPhoneInvalid(false);
      }
    } else if (firstName || middleName || lastName) {
      if (!firstName) {
        setFirstNameInvalid(true);
        ++fieldsInvalid;
      } else {
        setFirstNameInvalid(false);
      }
      if (!lastName) {
        setLastNameInvalid(true);
        ++fieldsInvalid;
      } else {
        setLastNameInvalid(false);
      }
    } else if (street || city || zip) {
      if (!street) {
        setStreetInvalid(true);
        ++fieldsInvalid;
      } else {
        setStreetInvalid(false);
      }
    }
    if (!ssntin && !accountNumber && !phone && !firstName && !lastName && !street) {
      ++fieldsInvalid;
    }
    return fieldsInvalid === 0;
  };

  const clearFormHandler = (e) => {
    setSSNTin("");
    setAccountNumber("");
    setPhone("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setStreet("");
    setCity("");
    setZip("");
    setSSNInvalid(false);
    setAccountNumberInvalid(false);
    setPhoneInvalid(false);
    setFirstNameInvalid(false);
    setLastNameInvalid(false);
    setStreetInvalid(false);
  };

  return (
    <form className={classes.main} onSubmit={submitFormHandler} autocomplete="off">
      <div className={classes.mainForm}>
        <div className={classes.custinfoform}>
          <InputNumber
            label="SSN/TIN"
            id="ssntin"
            options={{ blocks: [3, 2, 4], delimiter: "-" }}
            value={ssntin}
            onChange={setSSNTin}
            disabled={ssntinRO}
            invalid={ssnInvalid}
            invalidMessage="SSN format xxx-xx-xxxx"
          />
          <InputNumber
            label="Phone"
            id="phoneNumber"
            options={{ blocks: [3, 3, 4], delimiter: "-" }}
            value={phone}
            onChange={setPhone}
            disabled={phoneRO}
            invalid={phoneInvalid}
            invalidMessage="Phone format xxx-xxx-xxxx"
          />
          <InputNumber
            label="Account Number"
            id="accoutNumber"
            options={{ blocks: [5, 5], delimiter: "-" }}
            value={accountNumber}
            onChange={setAccountNumber}
            disabled={accountNumberRO}
            invalid={accountNumberInvalid}
            invalidMessage="Account Number format xxxxx-xxxxx"
          />
          <Input label="First Name" id="fname" value={firstName} onChange={setFirstName} disabled={firstNameRO} invalid={firstNameInvalid} invalidMessage="First Name is a required field" />
          <Input label="Middle Name" id="mname" value={middleName} onChange={setMiddleName} disabled={middleNameRO} />
          <Input label="Last Name" id="lname" value={lastName} onChange={setLastName} disabled={lastNameRO} invalid={lastNameInvalid} invalidMessage="Last Name is a required field" />
        </div>
        <div className={classes.vertbar}></div>
        <div className={classes.premiseinfoform}>
          <div className={classes.premiseField}>
            <Input label="Street Address" id="streetAddress" value={street} onChange={setStreet} disabled={streetRO} invalid={streetInvalid} invalidMessage="Street Address is a required field" />
          </div>
          <Input label="City" id="city" value={city} onChange={setCity} disabled={cityRO} />
          <Input label="State" id="state" value={state} onChange={setState} disabled={stateRO} />
          <InputNumber label="Zip" id="zip" options={{ blocks: [4] }} value={zip} onChange={setZip} disabled={zipRO} />
        </div>
      </div>
      <div className="btnGrp">
        <ButtonCancel onClick={clearFormHandler}>Clear</ButtonCancel>
        <ButtonSubmit>Search</ButtonSubmit>
      </div>
    </form>
  );
};

export default React.memo(SearchForm);
