import React, { useEffect, useState } from "react";

import classes from "./Section.module.css";

const Section = (props) => {
  console.log("section renders", props.title);
  const iconPosition = props.children
    ? `${classes.header} ${classes.pointdown}`
    : `${classes.header}`;

  const noBtn = props.noBtn ? `${classes.noBtn}` : "";
  return (
    <div className={classes.section}>
      <button className={`${iconPosition} ${noBtn}`} onClick={props.onClick}>
        {props.title}
      </button>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

export default React.memo(Section);
