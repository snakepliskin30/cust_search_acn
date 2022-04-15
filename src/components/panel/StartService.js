import { Fragment } from "react";
import Accordion from "../layout/Accordion";
import CustomerInfo from "./CustomerInfo";
import PremiseInfo from "./PremiseInfo";

import classes from "./StartService.css";

const StartService = () => {
  return (
    <Fragment>
      <Accordion title="Premise Address" id="premiseinfo">
        <PremiseInfo />
      </Accordion>
      <Accordion title="Customer Information" id="custInfo">
        <CustomerInfo />
      </Accordion>
    </Fragment>
  );
};

export default StartService;
