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
        disabled={props.disabled}
        autoComplete="off"
      />
      <div className={classes.error}>{props.invalid && props.invalidMessage}</div>
    </div>
  );
};

export default InputNumber;
