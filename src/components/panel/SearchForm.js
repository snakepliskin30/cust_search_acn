import React, { Fragment, useState } from "react";
import Input from "../ui/Input";
import InputNumber from "../ui/InputNumber";
import ButtonSubmit from "../ui/ButtonSubmit";
import ButtonCancel from "../ui/ButtonCancel";

import classes from "./SearchForm.module.css";

const SearchForm = (props) => {
  const [zip, setZip] = useState("");

  const submitFormHandler = (e) => {
    props.onSubmit(e);
  };

  return (
    <form className={classes.main} onSubmit={submitFormHandler}>
      <div className={classes.mainForm}>
        <div className={classes.custinfoform}>
          <InputNumber
            label="SSN/TIN"
            id="ssntin"
            options={{ blocks: [4, 2, 3], delimiter: "-" }}
          />
          <InputNumber
            label="Account Number"
            id="accoutNumber"
            options={{ blocks: [5, 5], delimiter: "-" }}
          />
          <InputNumber
            label="Phone"
            id="phoneNumber"
            options={{ blocks: [3, 3, 4], delimiter: "-" }}
          />
          <Input label="First Name" id="fname" />
          <Input label="Middle Name" id="mname" />
          <Input label="Last Name" id="lname" />
        </div>
        <div className={classes.vertbar}></div>
        <div className={classes.premiseinfoform}>
          <div className={classes.premiseField}>
            <Input label="Street Address" id="streetAddress" />
          </div>
          <Input label="City" id="city" />
          <Input label="State" id="state" />
          <InputNumber
            label="Zip"
            id="zip"
            options={{ blocks: [4] }}
            value={zip}
            onChange={setZip}
          />
        </div>
      </div>
      <div className="btnGrp">
        <ButtonSubmit>Submit</ButtonSubmit>
        <ButtonCancel>Cancel</ButtonCancel>
      </div>
    </form>
  );
};

export default React.memo(SearchForm);
