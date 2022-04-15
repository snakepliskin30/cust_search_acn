import React, { useEffect } from "react";
import $ from "jquery";
import "jquery-ui-dist/jquery-ui";

import classes from "./InputDatePicker.module.css";

const InputDatePicker = (props) => {
  useEffect(() => {
    $(`#${props.id}`).datepicker();
  }, []);

  return (
    <div>
      <div className={classes.label} htmlFor={props.id}>
        {props.label}
      </div>
      <input id={props.id} type={props.type ? props.type : "text"} />
    </div>
  );
};

export default InputDatePicker;
