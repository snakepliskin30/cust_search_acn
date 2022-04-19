import React from "react";

import classes from "./Input.module.css";

const Input = (props) => {
  return (
    <div>
      <div className={classes.label} htmlFor={props.id}>
        {props.label}
      </div>
      <input
        id={props.id}
        type={props.type ? props.type : "text"}
        maxLength={props.length ? props.length : ""}
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

export default Input;
