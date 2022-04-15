import React, { Fragment, useEffect, useState, useCallback } from "react";
import Accordion from "../layout/Accordion";
import Field from "../ui/Field";
import Section from "../layout/Section";
import Input from "../ui/Input";
import InputNumber from "../ui/InputNumber";
import ButtonSubmit from "../ui/ButtonSubmit";
import ButtonCancel from "../ui/ButtonCancel";
import Spinner from "../ui/Spinner";

//Datatable Modules
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

import classes from "./PremiseInfo.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

const premiseArray = [
  {
    streetName: "800 Willow Ridge Way",
    city: "Atlanta",
    state: "Georgia",
    zip: "1234",
  },
  {
    streetName: "800 Willow Ridge Way",
    city: "Atlanta",
    state: "Georgia",
    zip: "1234",
  },
  {
    streetName: "800 Willow Ridge Way",
    city: "Atlanta",
    state: "Georgia",
    zip: "1234",
  },
  {
    streetName: "800 Willow Ridge Way",
    city: "Atlanta",
    state: "Georgia",
    zip: "1234",
  },
  {
    streetName: "800 Willow Ridge Way",
    city: "Atlanta",
    state: "Georgia",
    zip: "1234",
  },
];

const PremiseInfo = () => {
  console.log("premiseinfo renders");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("GA");
  const [zip, setZip] = useState("");
  const [apiCallFlag, setApiCallFlag] = useState(false);
  const [premiseResults, setPremiseResults] = useState([]);
  const [searchFormShow, setSearchFormShow] = useState(true);
  const [searchResultShow, setSearchResultShow] = useState(false);
  const [searchInfoShow, setSearchInfoShow] = useState(false);

  async function searchFormHandler(e) {
    e.preventDefault();
    setApiCallFlag(true);
    setSearchResultShow(false);
    setSearchInfoShow(false);

    const Request = {};
    const Payload = {};

    Payload.formattedAddress = streetName;
    Payload.city = city;
    Payload.state = state;
    Payload.zip = zip;

    Request.Payload = Payload;

    const requestString = JSON.stringify(Request);
    const url = `https://gpcservice--tst1.custhelp.com/cgi-bin/gpcservice.cfg/php/custom/socoapicalls_noauth.php`;
    const formData = new FormData();
    formData.append("data", requestString);
    formData.append("apiUrl", "CUSTOM_CFG_START_SEARCH_PREMISE_URL");

    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      body: formData,
    });

    const data = await response.json();
    const premiseResults = Array.from(
      new Set(data.Payload.AddressInfo.map((s) => s.premiseNo))
    ).map((premiseNum) =>
      data.Payload.AddressInfo.find((d) => d.premiseNo === premiseNum)
    );
    setPremiseResults(premiseResults);
    setSearchFormShow(false);
    setSearchResultShow(true);
    setSearchInfoShow(false);
    setApiCallFlag(false);
  }

  async function getPremiseDetailsHandler(premise) {
    const Request = {};
    const Header = {};
    const Payload = {};
    const PendingOrdersAndObligations = {};

    Header.verb = "post";
    Header.noun = "getPremise";
    Header.revision = "1.4";
    Header.userId = "EU_OSC";
    Header.organization = "SOCO";
    Header.transactionId = "1234567";

    PendingOrdersAndObligations.premiseNo = premise.premiseNo;
    PendingOrdersAndObligations.companyCode = "2";

    Payload.PendingOrdersAndObligations = PendingOrdersAndObligations;

    Request.Header = Header;
    Request.Payload = Payload;

    const requestString = JSON.stringify(Request);
  }

  useEffect(() => {
    if (premiseResults.length > 0) {
      setSearchFormShow(false);
      setSearchResultShow(true);
    }
  }, [premiseResults]);

  const searchFormSectionClick = useCallback(() => {
    setSearchFormShow((current) => !current);
  }, []);
  const searchResultSectionClick = useCallback(() => {
    setSearchResultShow((current) => !current);
  }, []);
  const searchInfoSectionClick = useCallback(() => {
    setSearchInfoShow((current) => !current);
  }, []);

  return (
    <Fragment>
      {apiCallFlag && <Spinner />}
      <div className={classes.main}>
        <Section title="Search" onClick={searchFormSectionClick}>
          {searchFormShow && (
            <form className={classes.searchForm} onSubmit={searchFormHandler}>
              <Input
                label="Street Name"
                id="streetName"
                value={streetName}
                onChange={setStreetName}
              />
              <Input label="City" id="city" value={city} onChange={setCity} />
              <Input
                label="State"
                id="state"
                value={state}
                onChange={setState}
              />
              <InputNumber
                label="Zip"
                id="zip"
                options={{ blocks: [4] }}
                value={zip}
                onChange={setZip}
              />
              <div className="btnGrp">
                <ButtonSubmit>Submit</ButtonSubmit>
                <ButtonCancel>Cancel</ButtonCancel>
              </div>
            </form>
          )}
        </Section>

        <Section title="Search Results" onClick={searchResultSectionClick}>
          {searchResultShow && (
            <table id="searchResults" className="table table-striped">
              <thead>
                <tr>
                  <th>Street Name</th>
                  <th>Address Notes</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Zip</th>
                </tr>
              </thead>
              <tbody>
                {premiseResults.map((premise, index) => (
                  <tr
                    key={index}
                    className={classes.resultsrow}
                    onClick={getPremiseDetailsHandler.bind(null, premise)}
                  >
                    <td>{premise.addressLine1}</td>
                    <td>{premise.AddressNotes}</td>
                    <td>{premise.city}</td>
                    <td>{premise.state}</td>
                    <td>{premise.zipCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>

        <Section title="Premise Information" onClick={searchInfoSectionClick}>
          {searchInfoShow && (
            <div>
              <div className={classes.premiseInfo}>
                <Section title="Details" open={true} noBtn>
                  <div className={classes.premiseInfoDetails}>
                    <Field label="Meter Point Status" value="Active"></Field>
                    <Field label="Meter Status" value="On"></Field>
                    <Field label="RD/DC Meter" value="Yes"></Field>
                    <Field label="Revenue Class" value="Residential"></Field>
                    <Field label="Rate" value="Residential"></Field>
                    <Field label="PrePay Eligible" value="Yes"></Field>
                  </div>
                </Section>
                <Section title="Pending Orders" open={true} noBtn>
                  <table id="searchResults" className="table table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Bill Account</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2022-04-29</td>
                        <td>Connect</td>
                        <td>78037-54259</td>
                      </tr>
                    </tbody>
                  </table>
                </Section>
              </div>

              <Section title="Pending Obligation" open={true} noBtn>
                <table id="pendingObligation" className="table table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Bill Account</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2022-04-29</td>
                      <td>Connect</td>
                      <td>78037-54259</td>
                    </tr>
                  </tbody>
                </table>
              </Section>
            </div>
          )}
        </Section>

        <div className="btnGrp">
          <div style={{ marginLeft: "auto" }}>
            <ButtonSubmit>Next</ButtonSubmit>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PremiseInfo;
