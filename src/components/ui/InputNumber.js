import React from "react";
import ReactDOM from "react-dom";
import Cleave from "cleave.js/react";

import classes from "./InputNumber.module.css";

const InputNumber = (props) => {
  return (
    <div className={classes.main}>
      <div className={classes.label} htmlFor={props.id}>
        {props.label}
      </div>
      <Cleave
        options={{ ...props.options, numericOnly: true }}
        value={props.value}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
    </div>
  );
};

export default InputNumber;
