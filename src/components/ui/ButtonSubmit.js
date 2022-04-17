import React from "react";

import classes from "./ButtonSubmit.module.css";

const ButtonSubmit = (props) => {
  return (
    <button className={classes.submit} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default ButtonSubmit;
