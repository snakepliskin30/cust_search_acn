import React from "react";
import Accordion from "../layout/Accordion";
import Input from "../ui/Input";
import InputNumber from "../ui/InputNumber";
import InputDatePicker from "../ui/InputDatePicker";
import TextArea from "../ui/TextArea";
import ButtonSubmit from "../ui/ButtonSubmit";
import ButtonCancel from "../ui/ButtonCancel";

import classes from "./CustomerInfo.module.css";

const CustomerInfo = () => {
  return (
    <form>
      <div className={classes.main}>
        <div className={classes.item_a}>
          <Input label="Title" id="title" />
        </div>
        <div className={classes.item_b}>
          <Input label="First Name" id="firstName" />
        </div>
        <div className={classes.item_c}>
          <Input label="Middle Name" id="middleName" />
        </div>
        <div className={classes.item_d}>
          <Input label="Last Name" id="lastName" />
        </div>
        <div className={classes.item_e}>
          <Input label="Suffix" id="suffix" />
        </div>
        <div className={classes.item_x}>
          <ButtonCancel>Copy</ButtonCancel>
        </div>
        <div className={classes.item_f}>
          <InputNumber label="SSN/TIN" id="ssntin" options={{ blocks: [4, 2, 3], delimiter: "-" }} />
        </div>
        <div className={classes.item_g}>
          <InputNumber label="Primary Phone" id="primaryPhone" options={{ blocks: [3, 3, 4], delimiter: "-" }} />
        </div>
        <div className={classes.item_h}>
          <InputNumber label="Alternate Phone" id="altPhone" options={{ blocks: [3, 3, 4], delimiter: "-" }} />
        </div>
        <div className={classes.item_i}>
          <InputDatePicker label="Date Of Birth" id="dob" />
        </div>
        <div className={`${classes.item_j} checkbox`}>
          <input type="checkbox" id="ssnnotprovided" name="ssnnotprovided" value="N" />
          <label htmlFor="ssnnotprovided">SSN/TIN not provided</label>
        </div>
        <div className={classes.item_k}>
          <Input label="Email Address" id="email" />
        </div>
        <div className={classes.item_l}>
          <InputNumber label="Driver's License Number" id="driverslicense" options={{ blocks: [15] }} />
        </div>
        <div className={classes.item_m}>
          <Input label="State" id="state" />
        </div>
        <div className={`${classes.item_n} checkbox`}>
          <input type="checkbox" id="emailnotprovided" name="emailnotprovided" value="N" />
          <label htmlFor="emailnotprovided">Email address not provided</label>
        </div>
        <div className={classes.item_o}>
          <TextArea label="Other Customer Information" id="otherInfo" />
        </div>
        <div className={classes.item_p}>
          <TextArea label="Comments" id="comments" />
        </div>

        <div className={`${classes.item_q} btnGrp`}>
          <ButtonSubmit>Submit</ButtonSubmit>
          <ButtonCancel>Cancel</ButtonCancel>
        </div>
      </div>
    </form>
  );
};

export default CustomerInfo;
