import React from "react";

import classes from "./Field.module.css";

const Field = (props) => {
  return (
    <div className={classes.field}>
      <div className={classes.label}>{props.label}</div>
      <div className={classes.value}>{props.value}</div>
    </div>
  );
};

export default Field;
