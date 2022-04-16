import React, { useState, useEffect, useRef } from "react";

import classes from "./Accordion.module.css";

const Accordion = (props) => {
  const headerId = `accordion-header-${props.id}`;

  const iconPosition = props.children
    ? `${classes.header} ${classes.pointdown} ${headerId}`
    : `${classes.header} ${headerId}`;

  return (
    <div className={classes.accordion} id={props.id}>
      <button className={iconPosition} onClick={props.onClick}>
        {props.title}
      </button>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

export default Accordion;
